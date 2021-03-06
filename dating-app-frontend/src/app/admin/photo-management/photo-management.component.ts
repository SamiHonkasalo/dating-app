import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Photo } from 'src/app/_models/photo';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css'],
})
export class PhotoManagementComponent implements OnInit {
  photos: Photo[];
  constructor(
    private adminService: AdminService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    this.adminService.getPhotosForApproval().subscribe(
      (photos: Photo[]) => {
        this.photos = photos;
      },
      (err) => {
        this.alertify.error(err);
      }
    );
  }

  approvePhoto(photoId: number) {
    this.adminService.approvePhoto(photoId).subscribe(
      () => {
        this.photos.splice(
          this.photos.findIndex((p) => p.id === photoId),
          1
        );
      },
      (err) => {
        this.alertify.error(err);
      }
    );
  }

  rejectPhoto(photoId: number) {
    this.adminService.rejectPhoto(photoId).subscribe(
      () => {
        this.photos.splice(
          this.photos.findIndex((p) => p.id === photoId),
          1
        );
      },
      (err) => {
        this.alertify.error(err);
      }
    );
  }
}
