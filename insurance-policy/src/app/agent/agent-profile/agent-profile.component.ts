import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-agent-profile',
  templateUrl: './agent-profile.component.html',
  styleUrls: ['./agent-profile.component.css']
})
export class AgentProfileComponent {
  agentProfile:any={}
  
  constructor(private agent:AgentService, private location: Location) {}

  ngOnInit() {
    const agentId = localStorage.getItem('id'); // Retrieve the customer ID from local storage
  
    if (agentId) {
      this.agent.getAgentProfile(agentId).subscribe({
        next: (response) => {
          this.agentProfile = response.body; // Access the response body
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to fetch customer profile:', err.message);
        }
      });
    } else {
      console.error('Customer ID is not available in local storage');
    }
  }
  

  goBack() {
    this.location.back(); // Navigate back to the previous page
  }
}