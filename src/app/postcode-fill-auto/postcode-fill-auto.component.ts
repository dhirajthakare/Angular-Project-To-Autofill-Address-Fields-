import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
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
      accessToken: environment.accessToken,
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
          this.updateValue();

          
            }
        }
      )
        
    }

  }

  updateValue(){
    this.clearMarker();
    
    const geocoder = new google.maps.Geocoder();
    var houseNameNumber = this.myform.get('Address').value;
    var streetname = this.myform.get('street_name').value;
    var address2 = this.myform.get('Address2').value;
    //var address3 = $("#address3").val();
    var town = this.myform.get('town').value;
    //var county = $("#county").val();
    var address = '';
    if(houseNameNumber){
      if(streetname){
        if(address2){
          if(town){
            address = houseNameNumber + ', ' + streetname + ', ' + address2 + ', ' + town;
          }else{
            address = houseNameNumber + ', ' + streetname + ', ' + address2;
          }
        }else{
          address = houseNameNumber + ', ' + streetname;
        }
      }else{
        address = houseNameNumber;
      }
    }else{
      address = 'London';
    }

    // if(propertynickname){
    //   address = propertynickname + ', ' + address; 
    // }

    address = address + ', ' +'United Kingdom';
    
    geocoder.geocode( { 'address': address}, (results:any, status:any) => {
        if (status == 'OK') {
            this.map.setCenter(results[0].geometry.location);
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            let marker = new google.maps.Marker({
                draggable: true,
                map: this.map,
                position: results[0].geometry.location,
                title: results[0].geometry.location
            });
            //infoWindow.open(map, marker);
            //infoWindow.setContent(address);
            
            $('#lat').val(marker.position.lat());
            $('#long').val(marker.position.lng());
            this.setPosition(marker,latitude,longitude);
        } else {
            //infoWindow.setContent('Cannot Determine Your Location');
            console.log('Geocode was not successful for the following reason: ' + status);
            
        }
    }); 

   
}

 setPosition(marker:any,latitude:any,longitude:any){
  let infoWindow = new google.maps.InfoWindow;
  this.myform.patchValue({
    "lat":latitude,
    "long":longitude

  })

  let Latlng = new google.maps.LatLng(latitude, longitude);
  let geocoder = new google.maps.Geocoder();
  infoWindow.open(this.map, marker);
  geocoder.geocode({
    latLng: Latlng
  }, (responses:any)=> {
    if (responses && responses.length > 0) {
      infoWindow.setContent(responses[0].formatted_address);
      var addr = responses[0].formatted_address;
      
    } else {
      infoWindow.setContent('Cannot determine address at this location.');
    }
  });
}

 clearMarker(){
  //infoWindow = new google.maps.InfoWindow;
  var marker = new google.maps.Marker({
      //draggable: true,
      map: null,
      //position: results[0].geometry.location,
      //title: results[0].geometry.location
  });
  let markers = [];
  this.map = null;
  for (let i = 0; i < markers.length; i++) {
    marker[i].setMap(this.map);
  }
  //var myLatlng = new google.maps.LatLng(51.507351, -0.127758);
  var myOptions = {
      zoom: 14,
      //center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
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
