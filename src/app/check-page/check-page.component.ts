import { TmplAstRecursiveVisitor } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Realm from 'realm-web';




@Component({
  selector: 'app-check-page',
  templateUrl: './check-page.component.html',
  styleUrls: ['./check-page.component.css']
})
export class CheckPageComponent implements OnInit {
  token: string;
  tokenId : string;
  
  //result : any;
  result = "Chargement ..."
  constructor(private route: ActivatedRoute) { }
 
  async verify(token, tokenId) {
    const app = new Realm.App('data-icqqg');
    
    try {
      await app.emailPasswordAuth.confirmUser({ token, tokenId });
      return "Votre adresse est vérifiée ! Vous pouvez fermer cette page."
    } catch (err) {
      console.error('Failed', err);
      //console.log (err.__zone_symbol__state)
      return "Erreur d'authentification : token expiré, invalide ou absent."
    }
  }
  

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        //console.log(params); // { order: "popular" }
        this.token = params.token;
        this.tokenId = params.tokenId;
        this.verify(this.token,this.tokenId).then((value) => {
          this.result = value;
        })
        //console.log(this.token); // popular
      }
    );
  }
  
}