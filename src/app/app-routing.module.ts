import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostcodeFillAutoComponent } from './postcode-fill-auto/postcode-fill-auto.component';

const routes: Routes = [
{path:'' , redirectTo:'postcodefill' , pathMatch:'full'},
{path:'postcodefill',component:PostcodeFillAutoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
