import {
  Component,
  Input,
  EventEmitter,
  Output,
  computed,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export type ErrorStateSeverity = 'info' | 'warning' | 'danger';
export type ErrorStateSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'aether-error-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    role: 'alert',
    '[attr.aria-live]': 'severity === "danger" ? "assertive" : "polite"',
  },
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss'],
})
export class ErrorStateComponent {
  @Input() severity: ErrorStateSeverity = 'danger';
  @Input() size: ErrorStateSize = 'md';
  @Input() title = '';
  @Input() message = '';
  @Input() errorCode = '';
  @Input() retryLabel = 'Réessayer';
  @Input() retryVariant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input({ transform: booleanAttribute }) showDetails = false;
  @Input() detailsText = '';
  @Input() detailsLabel = 'Détails techniques';
  @Input() hasActions = true;

  @Output() retry = new EventEmitter<void>();

  readonly hostClasses = computed(() => {
    return [`severity-${this.severity}`, `size-${this.size}`].join(' ');
  });

  onRetry(): void {
    this.retry.emit();
  }
}
