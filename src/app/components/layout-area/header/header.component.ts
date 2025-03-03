import { Component } from '@angular/core';
import { LogoComponent } from "../logo/logo.component";
import { UserMenuComponent } from "../../user-area/user-menu/user-menu.component";

@Component({
  selector: 'app-header',
  imports: [LogoComponent, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
