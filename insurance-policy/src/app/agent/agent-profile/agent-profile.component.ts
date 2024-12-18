import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AgentService } from 'src/app/services/agent.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-agent-profile',
  templateUrl: './agent-profile.component.html',
  styleUrls: ['./agent-profile.component.css']
})
export class AgentProfileComponent {
  agentProfile: any = {};
  isEditing: boolean = false; // To toggle edit mode
  editableUserName: string = ''; // Editable UserName field

  constructor(
    private agent: AgentService,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const agentId = localStorage.getItem('id'); // Retrieve the agent ID from local storage

    if (agentId) {
      this.agent.getAgentProfile(agentId).subscribe({
        next: (response) => {
          this.agentProfile = response.body;
          this.editableUserName = this.agentProfile.userName; // Set editable username
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to fetch agent profile:', err.message);
        }
      });
    } else {
      console.error('Agent ID is not available in local storage');
    }
  }

  goBack() {
    this.location.back();
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Restore original value when canceled
      this.editableUserName = this.agentProfile.userName;
    }
  }

  updateUserName() {
    const updatedData = {
      userName: this.editableUserName // Pass the updated UserName
    };
    this.agentProfile.userName = updatedData.userName;

    this.agent.updateAgentProfile(this.agentProfile).subscribe({
      next: () => {
        this.toastService.showToast('success', 'Profile updated successfully!');
        this.agentProfile.userName = this.editableUserName; // Update local value
        this.isEditing = false; // Exit edit mode
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating UserName:', err.message);
      }
    });
  }
}
