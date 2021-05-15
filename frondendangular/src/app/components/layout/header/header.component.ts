import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  AuthService
} from 'src/app/common/services/auth.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedIn: boolean = false;
  userName: string = "";
  pic: string = "";
  constructor(private authService: AuthService, private router: Router,public userService:UserService) {
  }

  ngOnInit(): void {
    this.authService.loginStatus.subscribe(status => {
      this.loggedIn = status;
    })

    this.userService.statusUser.subscribe(res =>{
      this.userName = res.userName;
      this.pic = res.usPic;
    })
    console.log("dos",this.userService.statusUser.subscribe(console.log));
    
  }


  

  logout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }



}