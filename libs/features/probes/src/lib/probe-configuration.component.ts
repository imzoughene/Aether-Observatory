import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProbeType } from '@aether/data-models';
import { ProbesService } from '@aether/data-services';
import { ButtonComponent } from '@aether/ui-shared';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';
import { ProbeDetailContext } from './probe-detail-context';

type ProbeConfigurationForm = {
  name: FormControl<string>;
  type: FormControl<ProbeType>;
  target: FormControl<string>;
  region: FormControl<string>;
  intervalSec: FormControl<number>;
  timeoutSec: FormControl<number>;
};

type FormStatus = 'idle' | 'saving' | 'success' | 'error';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  selector: 'aether-probe-configuration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="configuration-panel">
      <header>
        <div>
          <p class="eyebrow">Probe settings</p>
          <h3>Edit configuration</h3>
          <p class="intro">Update how this probe reaches and checks its target.</p>
        </div>
        <span class="required-note">* Required</span>
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="form-grid">
          <label [class.invalid]="showError('name')">
            Name <span>*</span>
            <input formControlName="name" autocomplete="off" />
            @if (showError('name')) {
              <small class="error">{{ errorMessage('name') }}</small>
            } @else if (form.controls.name.pending) {
              <small class="hint">Checking name availability...</small>
            }
          </label>

          <label>
            Probe type <span>*</span>
            <select formControlName="type">
              <option value="HTTP">HTTP</option>
              <option value="TCP">TCP</option>
              <option value="DNS">DNS</option>
              <option value="DB">Database</option>
              <option value="ICMP">ICMP</option>
            </select>
          </label>

          <label class="wide" [class.invalid]="showError('target')">
            Target <span>*</span>
            <input formControlName="target" placeholder="https://api.example.com/health" />
            @if (showError('target')) {
              <small class="error">{{ errorMessage('target') }}</small>
            }
          </label>

          <label [class.invalid]="showError('region')">
            Region <span>*</span>
            <input formControlName="region" placeholder="eu-west-1" />
            @if (showError('region')) {
              <small class="error">{{ errorMessage('region') }}</small>
            }
          </label>

          <label [class.invalid]="showError('intervalSec')">
            Check interval <span>*</span>
            <input type="number" formControlName="intervalSec" min="10" max="3600" />
            <small class="hint">10 to 3600 seconds</small>
            @if (showError('intervalSec')) {
              <small class="error">{{ errorMessage('intervalSec') }}</small>
            }
          </label>

          <label [class.invalid]="showError('timeoutSec') || form.hasError('timeoutTooLong')">
            Timeout <span>*</span>
            <input type="number" formControlName="timeoutSec" min="1" max="60" />
            <small class="hint">Must be shorter than the interval</small>
            @if (showError('timeoutSec') || form.hasError('timeoutTooLong')) {
              <small class="error">{{ errorMessage('timeoutSec') }}</small>
            }
          </label>
        </div>

        @if (status() === 'success') {
          <p class="status success" role="status">Probe configuration saved successfully.</p>
        }
        @if (status() === 'error') {
          <p class="status failure" role="alert">
            Unable to save this configuration. Please try again.
          </p>
        }

        <footer>
          <span class="form-state">{{
            form.invalid ? 'Review the highlighted fields' : 'Ready to save'
          }}</span>
          <aether-button type="submit" [loading]="status() === 'saving'" [disabled]="form.pending">
            Save changes
          </aether-button>
        </footer>
      </form>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .configuration-panel {
        padding: 24px;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
      }
      header,
      footer {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }
      h3 {
        margin: 0;
        color: #0f172a;
        font-size: 18px;
      }
      .eyebrow {
        margin: 0 0 4px;
        color: #0f766e;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .intro,
      .required-note,
      .form-state,
      .hint {
        color: #64748b;
        font-size: 12px;
      }
      .intro {
        margin: 8px 0 0;
        font-size: 13px;
      }
      form {
        margin-top: 24px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px 16px;
      }
      label {
        display: grid;
        gap: 7px;
        color: #334155;
        font-size: 12px;
        font-weight: 700;
      }
      label span {
        color: #0f766e;
      }
      .wide {
        grid-column: 1 / -1;
      }
      input,
      select {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 11px;
        border: 1px solid #cbd5e1;
        border-radius: 5px;
        color: #1e293b;
        background: #fff;
        font: inherit;
        font-size: 13px;
      }
      input:focus,
      select:focus {
        outline: 2px solid rgba(15, 118, 110, 0.2);
        border-color: #0f766e;
      }
      .invalid input,
      .invalid select {
        border-color: #dc2626;
      }
      .error {
        color: #b91c1c;
        font-weight: 500;
      }
      .status {
        margin: 24px 0 0;
        padding: 12px 14px;
        border-radius: 5px;
        font-size: 13px;
      }
      .success {
        color: #166534;
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
      }
      .failure {
        color: #991b1b;
        background: #fef2f2;
        border: 1px solid #fecaca;
      }
      footer {
        align-items: center;
        margin-top: 28px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
      }
      @media (max-width: 600px) {
        .configuration-panel {
          padding: 18px;
        }
        .form-grid {
          grid-template-columns: 1fr;
        }
        .wide {
          grid-column: auto;
        }
        footer {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ProbeConfigurationComponent {
  private readonly builder = inject(NonNullableFormBuilder);
  private readonly context = inject(ProbeDetailContext);
  private readonly probesService = inject(ProbesService);
  private readonly destroyRef = inject(DestroyRef);

  readonly status = signal<FormStatus>('idle');
  readonly form: FormGroup<ProbeConfigurationForm>;

  constructor() {
    const probe = this.context.probe();
    if (!probe) {
      throw new Error('Probe configuration requires a loaded probe.');
    }

    this.form = this.builder.group<ProbeConfigurationForm>(
      {
        name: this.builder.control(probe.name, {
          validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
          asyncValidators: [this.uniqueNameValidator(probe.id)],
          updateOn: 'blur',
        }),
        type: this.builder.control(probe.type, Validators.required),
        target: this.builder.control(probe.target, [Validators.required, Validators.minLength(3)]),
        region: this.builder.control(probe.region, [
          Validators.required,
          Validators.pattern(/^[a-z]{2}-[a-z]+-\d$/),
        ]),
        intervalSec: this.builder.control(probe.intervalSec, [
          Validators.required,
          Validators.min(10),
          Validators.max(3600),
        ]),
        timeoutSec: this.builder.control(probe.timeoutSec, [
          Validators.required,
          Validators.min(1),
          Validators.max(60),
        ]),
      },
      { validators: [this.timeoutValidator] }
    );
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.form.pending) {
      return;
    }

    const probe = this.context.probe();
    if (!probe) {
      this.status.set('error');
      return;
    }

    this.status.set('saving');
    this.probesService
      .update(probe.id, this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (savedProbe) => {
          this.context.probe.set(savedProbe);
          this.status.set('success');
        },
        error: () => this.status.set('error'),
      });
  }

  showError(controlName: keyof ProbeConfigurationForm): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  errorMessage(controlName: keyof ProbeConfigurationForm): string {
    const control = this.form.controls[controlName];
    if (control.hasError('required')) return 'This field is required.';
    if (control.hasError('minlength')) return 'Enter at least 3 characters.';
    if (control.hasError('maxlength')) return 'Use 50 characters or fewer.';
    if (control.hasError('pattern')) return 'Use a region such as eu-west-1.';
    if (control.hasError('min') || control.hasError('max'))
      return 'Enter a value within the allowed range.';
    if (control.hasError('unique')) return 'This probe name is already in use.';
    if (controlName === 'timeoutSec' && this.form.hasError('timeoutTooLong'))
      return 'Timeout must be shorter than the interval.';
    return 'Check this value.';
  }

  private readonly timeoutValidator = (control: AbstractControl): ValidationErrors | null => {
    const interval = control.get('intervalSec')?.value as number | undefined;
    const timeout = control.get('timeoutSec')?.value as number | undefined;
    return interval !== undefined && timeout !== undefined && timeout >= interval
      ? { timeoutTooLong: true }
      : null;
  };

  private uniqueNameValidator(excludeId: string) {
    return (control: AbstractControl<string>): Observable<ValidationErrors | null> =>
      timer(250).pipe(
        switchMap(() => this.probesService.nameExists(control.value, excludeId)),
        map((exists) => (exists ? { unique: true } : null)),
        catchError(() => of(null))
      );
  }
}
