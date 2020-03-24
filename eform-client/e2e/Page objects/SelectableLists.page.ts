import {PageWithNavbarPage} from './PageWithNavbar.page';

export class SelectableListsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public get items(): number {
    return $$('//app-entity-select-edit//ul//li').length;
  }
  public get entitySelectCreateBtn() {
    return $('#entitySelectCreateBtn');
  }

  public get entitySelectSearchField() {
    return $('#labelInput');
  }

  public get entitySelectCreateName() {
    return $('#createName');
  }

  public get entitySelectCreateImportListBtn() {
    return $('#importEntitySelectBtn');
  }

  public get entitySelectCreateItemListName() {
    return $('#createEntityItemName');
  }
  public get entitySelectCreateSingleItemBtn() {
    return $('#addSingleEntitySelectableItem');
  }

  public get entitySelectCreateSingleItemEditBtn() {
    return $('#entitySelectCreateSingleItemEdit');
  }

  public get entitySelectCreateSaveBtn() {
    return $('#createEntitySelectSaveBtn');
  }

  public get entitySelectCreateCancelBtn() {
    return $('#createEntitySelectCancelBtn');
  }

  public get entitySelectEditBtn() {
    return $('#entitySelectEditBtn');
  }

  public get entitySelectDeleteBtn() {
    return $('#entitySelectDeleteBtn');
  }

  public get entitySelectEditName() {
    return $('#editName');
  }

  public get entitySelectEditImportListBtn() {
    return $('#editEntitySelectImportBtn');
  }

  public get entitySelectEditSingleItemBtn() {
    return $('#editEntitySelectCreateItem');
  }

  public get entitySelectEditItemName() {
    return $('#entitySelectItemEditName{id}');
  }

  public get entitySelectEditSaveBtn() {
    return $('#editEntitySelectSaveBtn');
  }

  public get entitySelectEditCancelBtn() {
    return $('#editEntitySelectCancelBtn');
  }

  public get entitySelectImportTextArea() {
    return $('#entityImportTextArea');
  }
  public get entitySelectImportTextAreaEdit() {
    return $(`//app-entity-select-edit//textarea`);
  }
  public get entitySelectImportSaveBtn() {
    return $('#entityImportSaveBtn');
  }
  public get entitySelectImportEditSaveBtn() {
    return $(`//app-entity-select-edit//app-entity-select-import-list//button[1]`);
  }
  public get  entitySelectImportCancelBtn() {
    return $('#entityImportCancelBtn');
  }

  public get entitySelectDeleteDeleteBtn() {
    return $('#entitySelectDeleteDeleteBtn');
  }

  public get entitySelectDeleteCancelBtn() {
    return $('#entitySelectDeleteCancelBtn');
  }

  public get entitySelectEditItemNameBox() {
    return $('#entitySelectItemEditNameBox');
  }

  public get entitySelectEditItemSaveBtn() {
    return $('#entitySelectItemSaveBtn');
  }

  public get entitySelectEditItemCancelBtn() {
    return $('#entitySelectItemCancelBtn');
  }

  public get firstEntityItemName() {
    return $(`//app-entity-select-edit//ul//li[1]//div[2]`);
  }
  public get entityItemEditBtn() {
    return $('#entitySelectEditItemEditBtn');
  }
  public get entityItemDeleteBtn() {
    return $('//app-entity-select-edit//ul//li[1]//div[3]//a[2]');
  }

  public get entityItemEditNameBox() {
    return $(`//app-entity-select-edit//input[@id= 'entitySelectItemEditNameBox']`);
  }

  public get entityItemList() {
    return $(`//app-entity-select-edit//ul`);
  }
  public get entityItemEditSaveBtn() {
    return $(`//app-entity-select-edit//button[@id= 'entitySelectItemSaveBtn']`);
  }
  public get entityItemEditCancelBtn() {
    return $(`//app-entity-select-edit//button[@id= 'entitySelectItemCancelBtn']`);
  }
  getFirstRowObject(): SelectableListRowObject {
    return new SelectableListRowObject(1);
  }
  getFirstItemObject(): EntitySelectItemRowObject {
    return new EntitySelectItemRowObject(1);
  }
  public goToEntitySelectPage() {
    this.Navbar.goToEntitySelect();
  }
  public createSelectableList_NoItem(name: string) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(4000);
    this.entitySelectCreateSaveBtn.click();
    browser.pause(4000);
  }
  public createSelectableList_OneItem(name, itemName) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateSingleItemBtn.click();
    browser.pause(1000);
    this.entitySelectCreateSingleItemEditBtn.click();
    browser.pause(1000);
    this.entitySelectEditItemNameBox.addValue(itemName);
    this.entitySelectEditItemSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateSaveBtn.click();
    browser.pause(4000);
  }
  public createSelectableList_MultipleItems(name, itemNames) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateImportListBtn.click();
    browser.pause(1000);
    this.entitySelectImportTextArea.addValue(itemNames);
    browser.pause(2000);
    this.entitySelectImportSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateSaveBtn.click();
    browser.pause(4000);
  }

  public createSelectableList_NoItem_Cancels(name) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(4000);
    this.entitySelectCreateCancelBtn.click();
    browser.pause(4000);
  }
  public createSelectableList_OneItem_Cancels(name, itemName) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateSingleItemBtn.click();
    browser.pause(1000);
    this.entitySelectCreateSingleItemEditBtn.click();
    browser.pause(1000);
    this.entitySelectEditItemNameBox.addValue(itemName);
    this.entitySelectEditItemSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateCancelBtn.click();
    browser.pause(4000);
  }
  public createSelectableList_MultipleItems_Cancels(name, itemNames) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateImportListBtn.click();
    browser.pause(1000);
    this.entitySelectImportTextArea.addValue(itemNames);
    browser.pause(2000);
    this.entitySelectImportSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateCancelBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameOnly(newName) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.entitySelectEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameOnly_Cancels(newName) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.entitySelectEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameAndItem(newName, newItemName) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.editItemName(newItemName);
    this.entitySelectEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSelectableListOnlyItem(newItemName) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.editItemName(newItemName);
    this.entitySelectEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameAndItem_Cancels(newName, newItemName) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.editItemName(newItemName);
    this.entitySelectEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameAndItem_CancelsBoth(newName, newItemName) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.editItemName_Cancels(newItemName);
    this.entitySelectEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameAndItem_CancelsItemName(newName, newItemName) {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.editItemName_Cancels(newItemName);
    this.entitySelectEditSaveBtn.click();
    browser.pause(4000);
  }
  public deleteItemFromList() {
    browser.waitForVisible('#spinner-animation', 50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.deleteItem();
    browser.pause(1000);
    this.entitySelectEditSaveBtn.click();
    browser.pause(4000);
  }
  public deleteList() {
    const deleteList = this.getFirstRowObject();
    if (deleteList != null) {
      browser.pause(8000);
      deleteList.deleteBtn.click();
      browser.pause(4000);
      this.entitySelectDeleteDeleteBtn.click();
      browser.pause(1000);
      browser.refresh();
    }
  }
  public editItemName(newItemName) {
    this.entityItemEditBtn.click();
    browser.pause(4000);
    this.entityItemEditNameBox.clearElement();
    this.entityItemEditNameBox.addValue(newItemName);
    this.entityItemEditSaveBtn.click();
    browser.pause(2000);
  }
  public editItemName_Cancels(newItemName) {
    const firstItem = this.getFirstItemObject();
    firstItem.editBtn.click();
    $('#entityItemEditNameBox').waitForDisplayed(20000);
    this.entityItemEditNameBox.clearElement();
    this.entityItemEditNameBox.addValue(newItemName);
    this.entityItemEditCancelBtn.click();
    browser.pause(2000);
  }
  public deleteItem() {
    this.entityItemDeleteBtn.click();
    browser.pause(2000);
  }
  public cleanup() {
    const deleteObject = this.getFirstRowObject();
    if (deleteObject != null) {
      browser.pause(8000);
      deleteObject.deleteBtn.click();
      browser.pause(4000);
      this.entitySelectDeleteDeleteBtn.click();
      browser.pause(1000);
      browser.refresh();
    }
  }
}
const selectableLists = new SelectableListsPage();
export default selectableLists;

export class SelectableListRowObject {
  constructor(rowNumber) {
    if ($$('#entitySelectMicrotingUUID')[rowNumber - 1]) {
      this.id = $$('#entitySelectMicrotingUUID')[rowNumber - 1];
      try {
        this.name = $$('#entitySelectName')[rowNumber - 1].getText();
      } catch (e) {}
      try {
        this.deleteBtn = $$('#entitySelectDeleteBtn')[rowNumber - 1];
      } catch (e) {}
      try {
        this.editBtn = $$('#entitySelectEditBtn')[rowNumber - 1];
      } catch (e) {}
    }
  }
  id;
  name;
  editBtn;
  deleteBtn;
}
export class EntitySelectItemRowObject {
  constructor(rowNumber) {
    if ($$('#entitySelectItemEditNameentityItemUId')[rowNumber - 1]) {
      this.name = $$('#entitySelectItemEditNameentityItemUId')[rowNumber - 1].getText();
      try {
        this.editBtn = $$('#entitySelectEditItemEditBtn')[rowNumber - 1];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#entitySelectEditItemDeleteBtn')[rowNumber - 1];
      } catch (e) {}
    }
  }
  name;
  editBtn;
  deleteBtn;
}
