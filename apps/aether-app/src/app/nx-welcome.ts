import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'aether-nx-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nx-welcome.html',
  styleUrls: ['./nx-welcome.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcome {}
