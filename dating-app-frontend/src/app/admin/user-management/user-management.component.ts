import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;
  constructor(
    private adminService: AdminService,
    private alertify: AlertifyService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (err) => {
        this.alertify.error(err);
      }
    );
  }

  editRolesModal(user: User) {
    const initialState = {
      user,
      roles: this.getRolesArray(user),
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, {
      initialState,
    });
    this.bsModalRef.content.updateSelectedRoles.subscribe((values) => {
      const rolesToUpdate = {
        roleNames: [...values.filter((v) => v.checked).map((r) => r.name)],
      };
      if (rolesToUpdate?.roleNames?.length > 0) {
        this.adminService.updateUserRoles(user, rolesToUpdate).subscribe(
          () => {
            user.roles = [...rolesToUpdate.roleNames];
          },
          (err) => this.alertify.error(err)
        );
      }
    });
  }

  private getRolesArray(user: User) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Member', value: 'Member' },
      { name: 'VIP', value: 'VIP' },
    ];

    availableRoles.forEach((a) => {
      let isMatch = false;
      userRoles.forEach((r: string) => {
        if (a.name === r) {
          isMatch = true;
          a.checked = true;
          roles.push(a);
          return;
        }
      });
      if (!isMatch) {
        a.checked = false;
        roles.push(a);
      }
    });
    return roles;
  }
}
