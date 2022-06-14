import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
declare var clickToAddress: any;
declare var $: any;


@Component({
  selector: 'app-postcode-fill-auto',
  templateUrl: './postcode-fill-auto.component.html',
  styleUrls: ['./postcode-fill-auto.component.css']
})
export class PostcodeFillAutoComponent implements OnInit {

  myform: any = this.fb.group({
    'postcode': '',
    'town': '',
    'Address': '',
    'Address2': '',
    'Address3': '',
    'street_name': '',
    'county': '',
    'country': '',
    'unitno': '',
  })

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fillAutoPostcode();
  }



  fillAutoPostcode(){
    
    const cc_object = new clickToAddress({
      accessToken: "674c3-d013e-970d7-0763d",
      domMode: 'class', // Use names to find form elements
      defaultCountry: 'gbr',
      countryLanguage: 'en',
      enabledCountries: ['gbr']
    });

    if ($(".auto_search")[0]) { // an class which available then only search address work
      cc_object.attach({
        search:		'auto_search', // class name should be here 
      } ,
      {
        onResultSelected: (c2a:any, elements:any, address:any)=> {

          this.myform.patchValue({
            'postcode': address.postal_code,
            'town': address.locality,
            'Address': address.line_1,
            'Address2': address.line_2,
            'Address3': address.line_3,
            'street_name': address.street_name+" "+address.street_suffix,
            'county': address.province_name,
            'country': address.country_name,
          
          })
          this.myform.updateValueAndValidity({ onlySelf: false, emitEvent: true })
          
            }
        }
      )
        
    }

  }

  insertData() {
    console.log(this.myform.value);

  }

}
