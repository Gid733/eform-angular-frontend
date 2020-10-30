import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import {
  NavigationMenuItemIndexedModel,
  NavigationMenuItemModel,
  NavigationMenuModel,
} from 'src/app/common/models/navigation-menu';
import {
  NavigationMenuService,
  SecurityGroupsService,
} from 'src/app/common/services';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import { NavigationMenuItemEditComponent } from '../menu-item/navigation-menu-item-edit/navigation-menu-item-edit.component';
import { NavigationMenuItemDeleteComponent } from '../menu-item/navigation-menu-item-delete/navigation-menu-item-delete.component';
import { NavigationMenuResetComponent } from '../navigation-menu-reset/navigation-menu-reset.component';
import { CommonDictionaryModel } from 'src/app/common/models';
import * as R from 'ramda';
import { EventBrokerService } from 'src/app/common/helpers';

@AutoUnsubscribe()
@Component({
  selector: 'app-navigation-menu-page',
  templateUrl: './navigation-menu-page.component.html',
  styleUrls: ['./navigation-menu-page.component.scss'],
})
export class NavigationMenuPageComponent implements OnInit, OnDestroy {
  @ViewChild('deleteMenuItemModal')
  deleteMenuItemModal: NavigationMenuItemDeleteComponent;
  @ViewChild('editMenuItemModal')
  editMenuItemModal: NavigationMenuItemEditComponent;
  @ViewChild('resetMenuModal')
  resetMenuModal: NavigationMenuResetComponent;
  navigationMenuSub$: Subscription;
  updateNavigationMenuSub$: Subscription;
  securityGroupsSub$: Subscription;
  resetSub$: Subscription;
  securityGroups: CommonDictionaryModel[] = [];
  navigationMenuModel: NavigationMenuModel = new NavigationMenuModel();

  get menuItemTypes() {
    return NavigationMenuItemTypeEnum;
  }

  constructor(
    private dragulaService: DragulaService,
    private navigationMenuService: NavigationMenuService,
    private securityGroupsService: SecurityGroupsService,
    private eventBrokerService: EventBrokerService
  ) {
    dragulaService.createGroup('MENU_ITEMS', {
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      },
      copy: (el, source) => {
        return source.id === 'mainMenu' || source.id === 'pluginMenu';
      },
      copyItem: (data: NavigationMenuItemModel) => {
        return { ...data, type: NavigationMenuItemTypeEnum.Link };
      },
      accepts: (el, target) => {
        // To avoid dragging from right to left container
        return (
          (target.classList.contains('dragula-item') ||
            (target.classList.contains('dragula-dropdown') &&
              !el.classList.contains('dragula-dropdown'))) &&
          target.id !== 'mainMenu' &&
          target.id !== 'pluginMenu'
        );
      },
    });
  }

  ngOnInit(): void {
    this.getNavigationMenu();
    this.getSecurityGroups();
  }

  getSecurityGroups() {
    this.securityGroupsSub$ = this.securityGroupsService
      .getSecurityGroupsDictionary()
      .subscribe((data) => {
        if (data && data.success) {
          this.securityGroups = data.model;
        }
      });
  }

  getNavigationMenu() {
    this.navigationMenuSub$ = this.navigationMenuService
      .getNavigationMenu()
      .subscribe((data) => {
        if (data && data.success) {
          this.navigationMenuModel = data.model;
        }
      });
  }

  getHeaderNavigationMenu() {
    this.eventBrokerService.emit<void>('get-navigation-menu', null);
  }

  updateNavigationMenu() {
    this.updateNavigationMenuSub$ = this.navigationMenuService
      .updateNavigationMenu(this.navigationMenuModel.actualMenu)
      .subscribe(() => {
        this.getHeaderNavigationMenu();
      });
  }

  manualAddItemToMenu(model: NavigationMenuItemModel) {
    this.navigationMenuModel.actualMenu = [
      ...this.navigationMenuModel.actualMenu,
      model,
    ];
  }

  ngOnDestroy(): void {}

  onItemDelete(
    model: NavigationMenuItemModel,
    firstLevelIndex: number,
    secondLevelIndex?: number | null
  ) {
    this.deleteMenuItemModal.show(model, firstLevelIndex, secondLevelIndex);
  }

  onItemEdit(
    model: NavigationMenuItemModel,
    firstLevelIndex: number,
    secondLevelIndex?: number | null
  ) {
    this.editMenuItemModal.show(
      { ...model },
      firstLevelIndex,
      secondLevelIndex
    );
  }

  onItemEditConfirm(model: NavigationMenuItemIndexedModel) {
    if (model.secondLevelIndex >= 0) {
      const updatedChildren = R.update(
        model.secondLevelIndex,
        model.item,
        this.navigationMenuModel.actualMenu[model.firstLevelIndex].children
      );
      this.navigationMenuModel.actualMenu[model.firstLevelIndex].children = {
        ...updatedChildren,
      };
    } else {
      this.navigationMenuModel.actualMenu = R.update(
        model.firstLevelIndex,
        model.item,
        this.navigationMenuModel.actualMenu
      );
    }
  }

  onItemDeleteConfirm(model: NavigationMenuItemIndexedModel) {
    if (model.secondLevelIndex >= 0) {
      const updatedChildren = R.remove(
        model.secondLevelIndex,
        1,
        this.navigationMenuModel.actualMenu[model.firstLevelIndex].children
      );
      this.navigationMenuModel.actualMenu[model.firstLevelIndex] = {
        ...this.navigationMenuModel.actualMenu[model.firstLevelIndex],
        collapsed: false,
        children: updatedChildren,
      };
    } else {
      this.navigationMenuModel.actualMenu = R.remove(
        model.firstLevelIndex,
        1,
        this.navigationMenuModel.actualMenu
      );
    }
  }

  onResetMenuConfirm() {
    this.resetSub$ = this.navigationMenuService
      .restNavigationMenu()
      .subscribe((data) => {
        if (data && data.success) {
          this.getHeaderNavigationMenu();
          this.getNavigationMenu();
        }
      });
  }

  showResetNavigationMenuModal() {
    this.resetMenuModal.show();
  }
}