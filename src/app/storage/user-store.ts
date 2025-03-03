import { withDevtools } from "@angular-architects/ngrx-toolkit";
import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { environment } from "../../environments/environment";
import { UserModel } from "../models/user.model";

// State (data) type: 
export type UserState = {
    user: UserModel;
};

// Initial state: 
const initialState: UserState = {
    user: null
};

// Store: 
export const UserStore = signalStore(

    { providedIn: "root" }, // Singleton object for DI.

    withState(initialState), // Initial state.

    withMethods(store => ({ // Operations we can perform.

        initUser(user: UserModel): void { // Init User in Register or Login
            patchState(store, _currentState => ({ user }));
        },

        logoutUser(): void { // Logout user.
            patchState(store, _currentState => ({ user: null as UserModel }));
        }
    })),

    withComputed(store => ({ // Computed signals

        fullName: computed(() => `${store.user()?.firstName} ${store.user()?.lastName}`)

    })),

    environment.isDevelopment && withDevtools("UserStore") // Dev tool
);


