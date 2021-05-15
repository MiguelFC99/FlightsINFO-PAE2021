import {
  Component,
  OnInit
} from '@angular/core';
import {
  AuthService
} from 'src/app/common/services/auth.service';
import {
  UserService
} from 'src/app/common/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  pageAirportsFav:number = 1;

  favFlistEmpty:boolean = false;
  favAirListEmpty:boolean = false;

  /*airportsFavorite:any = [{
    iata_code: "AAA",
    airportName: "Anaa",
    country: "French Polynesia",
    timezone: "Pacific/Tahiti",
  }];*/


  user: any = {
    userName: "",
    lastName: "",
    email: "",
    password: "",
    picture: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"

  };

  favoriteFlightsList:any =[];
  favoriteAirportsList:any = [];

  file:any;
  linksList:any = []
  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userService.getUserbyId().then(results => {
      console.log("resultado correcto ", results);
      this.user = results.user;
      this.userService.statusUs({
        userName: this.user.userName,
        usPic: this.user.picture
      })
    }).catch(err => {
      console.log("resultado incorrecto ", err);
    })

    this.userService.getFavoriteListUser().then(list =>{
      this.favoriteFlightsList = list;
    }).catch(err=>{
      console.log("error: ",err);
      if(err.error.err == 402) this.favFlistEmpty = true;
    })


    this.userService.getFavAirportsListUser().then(list=>{
      this.favoriteAirportsList = list;
    }).catch(err=>{
      console.log("error: ",err);
      if(err.error.err == 402) this.favAirListEmpty = true;
    })
  }

  //Funciones
  deleteItemFlightsListFav(dataflight:any){
    this.userService.deleteItemFavoriteListUser(dataflight).then(result=>{
      console.log("Ok vuelo eliminado de FavList: ",result);
      this.userService.getFavoriteListUser().then(list =>{
        this.favoriteFlightsList = list;
      }).catch(err=>{
        console.log("error: ",err);
        if(err.error.err == 402) this.favFlistEmpty = true;
      })
    }).catch(err=>{
      console.log("error al eliminar vuelo FavList: ",err)
    });
  }


  deleteAirportFavList(codeIata:string){
    this.userService.deleteItemFavAirportsListUser(codeIata).then(result=>{
      console.log("Ok aeropuerto eliminado de FavList: ",result);
      this.userService.getFavAirportsListUser().then(list =>{
        this.favoriteAirportsList = list;
      }).catch(err=>{
        console.log("error: ",err);
        if(err.error.err == 402) this.favAirListEmpty = true;
      })
    }).catch(err=>{
      console.log("error al eliminar aeropuerto FavList: ",err);
    })

  }

  selectImage(event:any){
    if(event.target.files.length>0){
      const file:File = event.target.files[0];
      this.file = file;
      console.log("holaa",file);
    }else{
      console.log(":C ")
    }
  }

  sendFile(){
    const formData = new FormData();
    formData.append('file',this.file)
    this.userService.sendFileItinerario(formData).then(result=>{
      this.linksList = (result);
      console.log("respuesta de file aws"+result);
    }).catch(err=>{
      console.log("error aws",err);
    })
  }

}


