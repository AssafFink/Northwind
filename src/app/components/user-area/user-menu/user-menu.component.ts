import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotifyService } from '../../../services/notify.service';
import { UserService } from '../../../services/user.service';
import { UserStore } from '../../../storage/user-store';

@Component({
    selector: 'app-user-menu',
    imports: [CommonModule, RouterLink],
    templateUrl: './user-menu.component.html',
    styleUrl: './user-menu.component.css'
})
export class UserMenuComponent {

    public userStore = inject(UserStore);
    public userService = inject(UserService);
    public notifyService = inject(NotifyService);

    public logMeOut(): void {
        this.userService.logout();
        this.notifyService.success("Bye bye");
    }

}
