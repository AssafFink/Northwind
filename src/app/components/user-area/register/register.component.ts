import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from '../../../models/user.model';
import { NotifyService } from '../../../services/notify.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

    private user = new UserModel();
    public userForm: FormGroup;

    public constructor(
        private userService: UserService,
        private router: Router,
        private formBuilder: FormBuilder,
        private notifyService: NotifyService
    ) { }

    public ngOnInit(): void {
        this.userForm = this.formBuilder.group({
            firstNameControl: new FormControl(""),
            lastNameControl: new FormControl(""),
            emailControl: new FormControl(""),
            passwordControl: new FormControl(""),
        });
    }

    public async send() {
        try {
            this.user.firstName = this.userForm.get("firstNameControl").value;
            this.user.lastName = this.userForm.get("lastNameControl").value;
            this.user.email = this.userForm.get("emailControl").value;
            this.user.password = this.userForm.get("passwordControl").value;
            await this.userService.register(this.user);
            this.notifyService.success(`Welcome ${this.user.firstName} ${this.user.lastName}!`);
            this.router.navigateByUrl("/home");
        }
        catch(err: any) {
            this.notifyService.error(err);
        }
    }

}
