import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'aether-mini-bar-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mini-bar-chart.component.html',
  styleUrls: ['./mini-bar-chart.component.scss'],
})
export class MiniBarChartComponent {
  readonly values = input<number[]>([]);
  readonly labels = input<string[]>([]);

  readonly normalizedBars = computed(() => {
    const values = this.values();
    if (!values.length) {
      return [];
    }

    const labels = this.labels();
    const max = Math.max(...values, 1);
    return values.map((value, index) => ({
      height: `${Math.round((value / max) * 100)}%`,
      label: labels[index] ?? '',
      value,
    }));
  });
}
