import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Http } from '@angular/http'
let questionData = {
  category: 'grammar',
  question: '',
  choice1: '',
  choice2: '',
  choice3: '',
  choice4: '',
  answer: ''

}
/*
  Generated class for the Questionform page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-questionform',
  templateUrl: 'questionform.html'
})
export class QuestionformPage {

  postConf = {
    id:'questions',
    name:'questions for quiz app'
  }

  idx:number;
  errorChk;
  option:string;
  

  url:string = 'http://xbase.esy.es/'
  question = questionData;
  constructor(
    private navCtrl: NavController,
    private http: Http,
    private navPar: NavParams
    ) {
      this.idx = parseInt(this.navPar.get('id'));
      console.log('this is idx: ' + this.idx + ' : '+  typeof(this.idx))
      this.getQuestion();
      if(this.idx){
        
      }else{
        
      }
      this.createPostConfig();
      this.onClickReset();      
    }

  ionViewDidLoad() {
    console.log('Hello QuestionformPage Page');

  }

  createPostConfig(){
    this.http.request( this.url + '?mc=post_config.create&id=' + this.postConf.id + '&name=' + this.postConf.name ).subscribe( s=>{
      console.log( 'this :::: ()' + s )
    })
  }

  onClickBack(){
    this.navCtrl.setRoot( HomePage );
  }


  onClickReset(){
    this.question.question = '';
    this.question.choice1 = '';
    this.question.choice2 = '';
    this.question.choice3 = '';
    this.question.choice4 = '';
  }

  getQuestion(){
    if( this.idx){
      
      this.http.get( this.url + '?mc=post.get&idx=' + this.idx ).subscribe(res=>{
        this.question.question = JSON.parse(res['_body']).data.title;
        this.question.choice1 = JSON.parse(res['_body']).data.extra_2;
        this.question.choice2 = JSON.parse(res['_body']).data.extra_3;
        this.question.choice3 = JSON.parse(res['_body']).data.extra_4;
        this.question.choice4 = JSON.parse(res['_body']).data.extra_5;
        this.question.answer = JSON.parse(res['_body']).data.extra_6;
      }, e=>{})
    }
  }

  

  validateForm(){
    if( this.question.question == ''){
      this.errorChk = { error: 'error' }
      return false;
    }
  }

  checkIDX(){
    if( ! this.idx ){
      this.option = '?mc=post.write&post_id=questions' ;
    }else{
      this.option = '?mc=post.edit&idx='+ this.idx +'&post_id=questions';
    }
  }

  grammarQuestion(){
    if ( this.validateForm() == false ) {
      return;
    }
    this.checkIDX();
    this.errorChk = { progress: 'progress'};
    this.http.request( 
      this.url 
        + this.option
        + '&extra_1='
        + this.question.category
        + '&title=' 
        + this.question.question 
        + '&extra_2=' 
        + this.question.choice1 
        + '&extra_3=' 
        + this.question.choice2 
        + '&extra_4=' 
        + this.question.choice3
        + '&extra_5='
        + this.question.choice4
        + '&extra_6='
        + this.question.answer  
      )
      .subscribe( res=>{
      this.errorChk = { success: 'success' }
      console.log( 'successfully added: ' + res );
      if( !this.idx ) this.onClickReset();
    },e=>{
      console.log( 'error' + e )
    })
  }

  vocaQuestion(){
    console.log(' voca ' + this.question.category);
  }

  photoQuestion(){
    console.log('pic ' + this.question.category )
  }

  onClickCreateQuestion(){
    if( this.question.category == 'grammar'){
      this.grammarQuestion();
    }else if( this.question.category == 'vocabulary' ){
      this.vocaQuestion();
    }else{
      this.photoQuestion();
    }
  }

}
