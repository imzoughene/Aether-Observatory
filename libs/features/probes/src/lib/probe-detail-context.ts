import { Injectable, signal } from '@angular/core';
import { Probe } from '@aether/data-models';

@Injectable()
export class ProbeDetailContext {
  readonly probe = signal<Probe | null>(null);
}
