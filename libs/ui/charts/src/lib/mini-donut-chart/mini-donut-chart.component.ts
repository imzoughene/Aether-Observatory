import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DonutSegment {
  value: number;
  color: string;
  label?: string;
}

@Component({
  selector: 'aether-mini-donut-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mini-donut-chart.component.html',
  styleUrls: ['./mini-donut-chart.component.scss'],
})
export class MiniDonutChartComponent {
  readonly segments = input<DonutSegment[]>([]);

  readonly gradient = computed(() => {
    const segments = this.segments().filter((segment) => segment.value > 0);
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);

    if (!total) {
      return 'conic-gradient(#e2e8f0 0% 100%)';
    }

    let cursor = 0;
    const stops = segments.map((segment) => {
      const start = cursor;
      cursor += (segment.value / total) * 100;
      return `${segment.color} ${start}% ${cursor}%`;
    });

    return `conic-gradient(${stops.join(', ')})`;
  });

  readonly legend = computed(() =>
    this.segments().filter((segment) => segment.label && segment.value > 0)
  );
}
