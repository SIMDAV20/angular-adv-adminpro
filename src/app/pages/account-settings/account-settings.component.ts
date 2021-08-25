import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  constructor(private settingsSerive: SettingsService) { }

  ngOnInit(): void {
    this.settingsSerive.checkCurrentTheme();
  }

  changeTheme( theme: string) {
    // console.log(theme);
    this.settingsSerive.changeTheme( theme );
  }



}
