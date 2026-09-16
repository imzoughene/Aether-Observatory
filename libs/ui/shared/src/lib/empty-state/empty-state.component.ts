import {
  Component,
  Input,
  EventEmitter,
  Output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'aether-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    role: 'status',
    'aria-live': 'polite',
  },
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = '';
  @Input() iconSvg = '';
  @Input() size: EmptyStateSize = 'md';
  @Input() actionLabel = '';
  @Input() hasActionContent = false;

  @Output() action = new EventEmitter<void>();

  readonly hostClasses = computed(() => [`size-${this.size}`].join(' '));

  onActionClick(): void {
    this.action.emit();
  }
}
