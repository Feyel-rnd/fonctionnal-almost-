import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BadgeDataService {
  private AnalysisToAnswer = new BehaviorSubject('');
  currentAnswerBadge = this.AnalysisToAnswer.asObservable();

  private MyAnalysis = new BehaviorSubject('');
  currentMyAnalysisBadge = this.MyAnalysis.asObservable();

  // private newMessage = new BehaviorSubject('');
  // currentMessageBadge = this.newMessage.asObservable();

  constructor() {}

  changeAnswerBadge(nombre: string) {
    //console.log(nombre)

    this.AnalysisToAnswer.next(this.removeBadgeIfZero(nombre));
  }

  changeMyAnalysisBadge(nombre: string) {
    //console.log(nombre)

    this.MyAnalysis.next(this.removeBadgeIfZero(nombre));
  }

  removeBadgeIfZero(y: string): string {
    var yy = +y;
    if (yy <= 0) {
      return '';
    }
    return yy.toString();
  }

  registerOrUnregister(choice: boolean) {
    //console.log(nombre)
    // BehaviorSubject._value
    var y = +this.MyAnalysis.getValue();
    if (choice) {
      y = y - 1;
    } else {
      y = y + 1;
    }

    this.changeMyAnalysisBadge(this.removeBadgeIfZero(y.toString()));
  }

  analysisDone() {
    //console.log(nombre)
    // BehaviorSubject._value
    var y = +this.AnalysisToAnswer.getValue();
    y = y - 1;

    this.changeAnswerBadge(this.removeBadgeIfZero(y.toString()));
  }
  //this.AnalysisToAnswer.next(nombre)
}
