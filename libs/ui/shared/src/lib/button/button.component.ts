import {
  Component,
  Input,
  booleanAttribute,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'aether-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'disabled || loading ? "" : null',
    '[attr.aria-disabled]': 'disabled || loading',
    '[attr.aria-busy]': 'loading',
    '[attr.type]': 'type',
  },
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) hideText = false;
  @Input() type: ButtonType = 'button';

  readonly hostClasses = computed(() => {
    const classes: string[] = [`variant-${this.variant}`, `size-${this.size}`];
    return classes.join(' ');
  });
}
