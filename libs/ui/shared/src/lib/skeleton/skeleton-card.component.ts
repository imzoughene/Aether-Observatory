import { Component, Input, booleanAttribute, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from './skeleton.component';
import { SkeletonTextComponent } from './skeleton-text.component';

@Component({
  selector: 'aether-skeleton-card',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, SkeletonTextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'presentation',
    'aria-hidden': 'true',
  },
  templateUrl: './skeleton-card.component.html',
  styleUrls: ['./skeleton-card.component.scss'],
})
export class SkeletonCardComponent {
  @Input({ transform: booleanAttribute }) header = true;
  @Input({ transform: booleanAttribute }) avatar = true;
  @Input({ transform: booleanAttribute }) footer = false;
  @Input() bodyLines = 3;

  readonly headerLineConfig = [
    { width: '60%', size: 'lg' as const },
    { width: '35%', size: 'sm' as const },
  ];
}
