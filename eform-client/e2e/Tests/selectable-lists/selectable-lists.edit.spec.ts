import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;


describe('Entity Select', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('should go to entity select page.', function () {
    selectableLists.goToEntitySelectPage();
    $('#entitySelectCreateBtn').waitForDisplayed({timeout: 20000});
  });
  it('should make a new selectable list, with no items.', function () {
    const name = Guid.create().toString();
    selectableLists.createSelectableList_NoItem(name);
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
  });
  it('should edit the list name, with no items.', function () {
    const newName = 'New Name';
    selectableLists.editSelectableListNameOnly(newName);
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(newName);
    selectableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
  it('should make a new selectable list, with 1 item', function () {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    selectableLists.createSelectableList_OneItem(name, itemName);
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
    selectableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#entitySelectItemEditNameentityItemUId_0').waitForDisplayed({timeout: 20000});
    expect(selectableLists.firstEntityItemName.getText()).equal(itemName);
    selectableLists.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
  it('should edit the list name, and item name', function () {
    const newName = 'New List Name';
    const newItemName = 'New Item Name';
    selectableLists.editSelectableListNameAndItem(newName, newItemName);
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(newName);
    selectableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#entitySelectItemEditNameentityItemUId_0').waitForDisplayed({timeout: 20000});
    expect(selectableLists.firstEntityItemName.getText()).equal(newItemName);
    selectableLists.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
  it('should make a new selectable list, with 1 item', function () {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    selectableLists.createSelectableList_OneItem(name, itemName);
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
    selectableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#entitySelectItemEditNameentityItemUId_0').waitForDisplayed({timeout: 20000});
    expect(selectableLists.firstEntityItemName.getText()).equal(itemName);
    selectableLists.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
  it('should only edit item name', function () {
    const newItemName = 'New Item Name';
    selectableLists.editSelectableListOnlyItem(newItemName);
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    const selectableList = selectableLists.getFirstRowObject();
    selectableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#entitySelectItemEditNameentityItemUId_0').waitForDisplayed({timeout: 20000});
    expect(selectableLists.firstEntityItemName.getText()).equal(newItemName);
    selectableLists.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    selectableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
  it('should make a new list with multiple items', function () {
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    selectableLists.createSelectableList_MultipleItems(name, itemNames);
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
  it('should edit the list with multiple items', function () {
    const newName = 'New List Name';
    const newItemNames = 'f\ng\nh\ni\nj';
    selectableLists.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    selectableLists.entitySelectEditName.clearValue();
    selectableLists.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.entitySelectEditImportListBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.entitySelectImportTextAreaEdit.addValue(newItemNames);
    browser.pause(1000);
    selectableLists.entitySelectImportEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    let selectableList = selectableLists.getFirstRowObject();
    selectableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#entitySelectItemEditNameentityItemUId_0').waitForDisplayed({timeout: 20000});
    expect(selectableLists.firstEntityItemName.getText()).equal('f');
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    expect(selectableLists.firstEntityItemName.getText()).equal('g');
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    expect(selectableLists.firstEntityItemName.getText()).equal('h');
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    expect(selectableLists.firstEntityItemName.getText()).equal('i');
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    expect(selectableLists.firstEntityItemName.getText()).equal('j');
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(newName);
    selectableLists.cleanup();
  });
});
