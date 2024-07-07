import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordService } from '../word/word.service'; // Import the service
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  board: string[][] = [];
  colors: string[][] = [];
  currentGuess: string = '';
  solution: string = '';
  currentRow: number = 0;
  result: boolean = false;
  errorMessage: string = '';
  streak: number = 0;
  failed: boolean = false;
  wordLength: number = 5;

  constructor(private wordService: WordService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.wordLength = +params.get('length')!;
      console.log("Word length: ", this.wordLength)
      this.initializeBoard();
      this.setRandomSolution();
    });
  }


  initializeBoard() {
    this.board = [];
    this.colors = [];
    const numRows = this.wordLength + 1;
    for (let i = 0; i < numRows; i++) {
      this.board.push(new Array(this.wordLength).fill(''));
      this.colors.push(new Array(this.wordLength).fill(''));
    }
  }

  setRandomSolution() {
    this.wordService.getWord(this.wordLength).subscribe({
      next: (word: string) => {
        if (word !== 'error') {
          this.wordService.checkWord(word).subscribe({
            next: (isValid: boolean) => {
              if (isValid) {
                this.solution = word.toUpperCase();
                console.log("Solution: ", this.solution);
              } else {
                this.setRandomSolution();
              }
            },
            error: () => {
              this.errorMessage = 'Error checking word during initialization';
              setTimeout(() => this.errorMessage = '', 2000);
            }
          });
        } else {
          this.errorMessage = 'Error fetching word';
          setTimeout(() => this.errorMessage = '', 2000);
        }
      },
      error: () => {
        this.errorMessage = 'Error fetching word';
        setTimeout(() => this.errorMessage = '', 2000);
      }
    });
  }

  makeGuess() {
    //console.log("Solution: ", this.solution);
    if (this.currentGuess.length !== this.wordLength) {
      this.errorMessage = `Guess must be ${this.wordLength} letters long`;
      setTimeout(() => this.errorMessage = '', 2000);
      return;
    }

    this.wordService.checkWord(this.currentGuess).subscribe({
      next: (isValid: boolean) => {
        if (isValid) {
          this.processGuess();
        } else {
          this.errorMessage = 'Invalid word';
          setTimeout(() => this.errorMessage = '', 2000); // Clear the error message after 2 seconds
        }
      },
      error: () => {
        this.errorMessage = 'Error checking word';
        setTimeout(() => this.errorMessage = '', 2000); // Clear the error message after 2 seconds
      }
    });
  }

  processGuess() {
    const guess = this.currentGuess.toUpperCase();
    for (let i = 0; i < this.wordLength; i++) {
      this.board[this.currentRow][i] = guess[i];
      this.colors[this.currentRow][i] = this.getColor(guess[i], i);
    }
    if (guess === this.solution) {
      this.result = true;
      this.streak++;
    }
    this.currentGuess = '';
    this.currentRow++;

    if (this.currentRow === this.wordLength+1 && !this.result) {
      this.streak = 0;
      this.failed = true;

    }
  }

  getColor(letter: string, index: number): string {
    if (letter === this.solution[index]) {
      return 'bg-green-500 text-white';
    } else if (this.solution.includes(letter)) {
      return 'bg-yellow-500 text-white';
    } else {
      return 'bg-gray-200 text-black';
    }
  }

  resetGame() {
    this.failed = false;
    this.currentGuess = '';
    this.currentRow = 0;
    this.result = false;
    this.errorMessage = '';
    this.initializeBoard();
    this.setRandomSolution();
  }

  goHome() {
    this.router.navigate(['/']);
  }
  
  @HostListener('document:keydown.enter', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if ((this.result || this.failed) && event.key === 'Enter') {
      this.resetGame();
    }
  }

}
