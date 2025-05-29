import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MessageService } from '../message.service';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    NgbAlertModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Home';
  messageFromChild = '';
  messageToChild = '';

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.currentMessage$.subscribe(msg => {
      this.messageFromChild = msg;
    });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  sendMessage() {
    this.messageService.updateMessage('Message from Home to children at ' + new Date().toLocaleTimeString());
  }
}
