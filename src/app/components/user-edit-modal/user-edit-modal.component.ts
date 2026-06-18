import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UserListItem, UserService } from '../../services/users/user.service';
import { ROLE_OPTIONS, ROLE_LABEL_MAP } from '../../utils/roles.constant';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss']
})
export class UserEditModalComponent implements OnChanges {
  @Input() user?: UserListItem;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  readonly roleOptions = ROLE_OPTIONS;
  readonly roleLabelMap = ROLE_LABEL_MAP;

  editForm: FormGroup;
  saving = false;
  originalRoles: string[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly notifications: NotificationsService
  ) {
    this.editForm = this.buildForm({ email: '', username: '', roles: [] });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.originalRoles = [...this.user.roles];
      this.editForm = this.buildForm({
        email: this.user.email,
        username: this.user.userName,
        roles: this.originalRoles
      });
    }
  }

  private buildForm(data: { email: string; username: string; roles: string[] }) {
    const roleGroup = this.roleOptions.reduce((group, role) => {
      group[role] = this.fb.control(data.roles.includes(role));
      return group;
    }, {} as { [key: string]: any });

    return this.fb.group({
      email: [{ value: data.email, disabled: true }],
      username: [{ value: data.username, disabled: true }],
      roles: this.fb.group(roleGroup)
    });
  }

  get selectedRoles() {
    const roles = this.editForm.get('roles')?.value || {};
    return Object.keys(roles).filter(role => roles[role]);
  }

  get addedRoles() {
    return this.selectedRoles.filter(role => !this.originalRoles.includes(role));
  }

  get hasChanges() {
    return this.addedRoles.length > 0;
  }

  isNewRole(role: string) {
    return this.addedRoles.includes(role);
  }

  getRoleLabel(role: string) {
    return this.roleLabelMap[role] ?? role;
  }

  close() {
    this.closed.emit();
  }

  save() {
    if (!this.user || this.saving) {
      return;
    }

    const rolesToAdd = this.addedRoles;
    if (rolesToAdd.length === 0) {
      this.notifications.send({ type: 'info', message: 'Nenhuma role nova selecionada.' });
      this.close();
      return;
    }

    this.saving = true;
    const requests = rolesToAdd.map(role => this.userService.updateRole(this.user!.userName, role));
    const request$: Observable<unknown> = requests.length > 0 ? forkJoin(requests) : of(null);

    request$.subscribe({
      next: () => {
        this.userService.updateUserList();
        this.notifications.send({
          type: 'success',
          message: `Roles adicionadas para ${this.user!.userName} com sucesso.`
        });
        this.saved.emit();
        this.close();
      },
      error: () => {
        this.notifications.send({
          type: 'error',
          message: `Falha ao salvar roles para ${this.user!.userName}.`
        });
      },
      complete: () => {
        this.saving = false;
      }
    });
  }
}
