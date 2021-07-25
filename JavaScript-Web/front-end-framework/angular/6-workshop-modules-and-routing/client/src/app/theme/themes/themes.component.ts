import { Component } from '@angular/core';
import { ContentService } from 'src/app/content.service';

import { ITheme } from '../../shared/interfaces';

@Component({
  selector: 'app-theme',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent {

  themes: ITheme[] | undefined;

  constructor(private contentService: ContentService) {
    this.fetchThemes();
  }

  fetchThemes(): void {
    this.themes = undefined;
    this.contentService.loadThemes().subscribe(themes => this.themes = themes);
  }
}
