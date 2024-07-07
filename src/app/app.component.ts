import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './game/game.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'wordle-clone';
}
