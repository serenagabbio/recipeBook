import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from "@angular/common/http";

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import 'Rxjs/Rx';
import { AuthService } from "../auth/auth.service";
import { text } from "@angular/core/src/render3/instructions";


@Injectable()
export class DataStorageService {
    constructor(
        private httpClient: HttpClient, 
        private recipeService: RecipeService,
        private authService: AuthService){}

    storeRecipes(){
        // //const headers = new HttpHeaders().set('Authorization', 'Bearer sjvdsfjl')
        // const params = new HttpParams().set('auth', token);

        // return this.httpClient.put('https://ng-recipe-book-59829.firebaseio.com/recipes.json',this.recipeService.getRecipes(), {
        //         observe: 'body',
        //         params: params
        //         //headers: headers
        //     });
        const req = new HttpRequest('PUT', 'https://ng-recipe-book-59829.firebaseio.com/recipes.json',
             this.recipeService.getRecipes(), {reportProgress: true})
        return this.httpClient.request(req);
    }

    getRecipes(){
        const token = this.authService.getToken();
        
        //this.httpClient.get<Recipe[]>('https://ng-recipe-book-59829.firebaseio.com/recipes.json?auth=' + token)
        this.httpClient.get<Recipe[]>('https://ng-recipe-book-59829.firebaseio.com/recipes.json', {
            observe: 'body',
            responseType: 'json'
        })
        .map(
            (recipes) => {
                for(let recipe of recipes){
                    if(!recipe['ingredients']){
                        console.log(recipe);
                        recipe['ingredients'] = [];
                    }
                }
                return recipes;
            }
        ).subscribe(
            (recipes) => {
                this.recipeService.setRecipes(recipes);
            }
        );
    }
}