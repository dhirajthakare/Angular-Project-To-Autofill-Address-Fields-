import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
declare var clickToAddress: any;
declare var $: any;
declare var google:any;

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
    'lat': '',
    'long': '',

  })

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fillAutoPostcode();
    this.loadMap();
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
  map:any;

  loadMap(){
    let myLatlng = new google.maps.LatLng(51.507351, -0.127758);

      let myOptions = {
          zoom: 5,
          center: myLatlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

      var marker = new google.maps.Marker({
          draggable: true,
          position: myLatlng,
          map: this.map,
          title: "Your location"
      });

      this.getPostion(marker);

  }

  getPostion(marker:any){
  let infoWindow = new google.maps.InfoWindow;
    
    google.maps.event.addListener(marker, 'dragend',  (event:any)=> {
      
      this.myform.patchValue({
        "lat":event.latLng.lat(),
        "long":event.latLng.lng()
      })
        
        let Latlng = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
        let geocoder = new google.maps.Geocoder();
        infoWindow.open(this.map, marker);
        geocoder.geocode({
          latLng: Latlng
        }, (responses:any)=> {
          if (responses && responses.length > 0) {
            infoWindow.setContent(responses[0].formatted_address);
            let addr = responses[0].formatted_address;
            addr = addr.split(',');
            let addr1 = addr[0].split(' ');
            if(addr1.length > 1){
              let len = addr1.length;
              let streetAddr = '';
              for(let i=1;i<len;i++){
                streetAddr += addr1[i];
              }


              this.myform.patchValue({
                "Address":addr1[0],
                "street_name":streetAddr
              })

            }else{
              this.myform.patchValue({
                "Address":addr1[0]
              })

            }
            
            this.myform.patchValue({
              "Address2":addr[1]
            })
            
            if(addr[addr.length-1] == "UK"){
              this.myform.patchValue({
                "Address":addr1[0]
              })
            }else{
              this.myform.patchValue({
                "country":'United Kingdom',
                "town":addr[addr.length-2]
              })
            }
          } else {
            infoWindow.setContent('Cannot determine address at this location.');
          }
        });
        
    });
}

}
