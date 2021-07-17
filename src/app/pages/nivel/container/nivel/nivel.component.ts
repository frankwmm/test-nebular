import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NivelService} from '../../../../../providers/nivel/nivel.service';;
import {Nivel} from '../../model/nivel';
import {Grado} from '../../../grado/model/grado';
import {NivelNewComponent} from '../../components/forms/nivel-new/nivel-new.component';
import { NivelEditComponent } from '../../components/forms/nivel-edit/nivel-edit.component';
import { NivelGradosComponent } from '../../components/forms/nivel-grados/nivel-grados.component';
//import { Prueba3Component } from '../../components/forms/prueba3/prueba3.component';

@Component({
  selector: 'app-nivel',
  templateUrl: './nivel.component.html',
  styleUrls: ['./nivel.component.scss']
})
export class NivelComponent implements OnInit {
  error:string;
  nivels:Nivel[];
  nivel:Nivel;
  grados:Grado[];

  constructor(private nivelService:NivelService, private modalService:NgbModal) { }

  ngOnInit(): void {
    this.getNiveles();
  }

  getNiveles():void{
    
    this.nivelService.getNivel().subscribe(response =>{
    this.nivels=response.data;
    console.log(this.nivels);
    console.log("asdfasdf");
    }, error =>{
      this.error=error
    });
  }

  public onNewNivel($event):void{
    console.log("prueba new nivel");
    if($event){
      const nivelForm=this.modalService.open(NivelNewComponent,{size:'lg'});
      nivelForm.componentInstance.title='New Nivel';
      nivelForm.result.then((result)=>{
        this.nivelService.postNivel(result).subscribe(response=>{
          if(response.success){
            this.getNiveles();
          }
        }, error=>{
          this.error=error
        });
      });
    }
  }

  editNivel(id:number):void{
    this.nivelService.getNivelById(id).subscribe(response=>{
      this.nivel=response.data;
      console.log("hola");
      console.log(this.nivel.nom_nivel);
      console.log("hola fin");
      const nivelForm=this.modalService.open(NivelEditComponent,{size:'lg'});
      nivelForm.componentInstance.title='Edit Nivel';
      nivelForm.componentInstance.nivel=this.nivel;
      nivelForm.result.then((result)=>{
        if(result){
          this.nivelService.updateNivel(this.nivel.id, result).subscribe(response=>{
            if (response.success){
              this.getNiveles();
            }
          }, error=>{
            this.error=error;
          });
        }
        console.log(result);
      });
    }, error=>{
      this.error=error;
    })
  }

  searchGradosOfNivel(id:number):void{
    this.nivelService.getGrados(id).subscribe(response=>{
      this.grados=response.data;

      for (let g of this.grados){  
        console.log("añslfjasdf");
        console.log(g.nom_grado);
        //this.listaNiveles.push(gg);
          
      }
      const gradosOfNivelForm=this.modalService.open(NivelGradosComponent,{size:'lg'});
      gradosOfNivelForm.componentInstance.title="Lista de grados";
      gradosOfNivelForm.componentInstance.grados=this.grados;
      console.log("inicio recuperar grados de nivel");
      console.log(this.grados);
      for (let g of this.grados){  
        console.log("añslfjasdf");
        console.log(g.nom_grado);
        //this.listaNiveles.push(gg);
          
      }
      
      console.log("fin recuperar grados de nivel");
    });

  }

  public delete(id: number):void{
    this.nivelService.deleteNivel(id).subscribe(response=>{
      if(response.success){
        this.getNiveles();
        console.log('ffff');
      }
    }, error=>{
      this.error=error;
    });
  }

}
