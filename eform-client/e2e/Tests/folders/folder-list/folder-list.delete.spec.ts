import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage, {FoldersRowObject} from '../../../Page objects/Folders.page';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;

describe('Delete folder', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
  });
  it('Should delete', function () {
    // Create
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    foldersPage.createNewFolder(name, description);
    const rowNumBeforeDelete = foldersPage.rowNum;

    $('#folderId').waitForDisplayed({timeout: 20000});
    const lastFolder = foldersPage.getFolder(rowNumBeforeDelete);
    lastFolder.deleteBtn.waitForDisplayed({timeout: 5000});
    lastFolder.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    foldersPage.saveDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();
    const rowNumAfterDelete = foldersPage.rowNum;
    expect(rowNumBeforeDelete, 'Folder was deleted incorrectly').equal(rowNumAfterDelete + 1);
  });
  it('Should not delete if cancel was clicked', function () {
    // Open
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();

    // Create
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    foldersPage.createNewFolder(name, description);

    // Delete
    const rowNumBeforeDelete = foldersPage.rowNum;
    $('#folderId').waitForDisplayed({timeout: 20000});
    const lastFolder = foldersPage.getFolder(rowNumBeforeDelete);
    lastFolder.deleteBtn.waitForDisplayed({timeout: 5000 });
    lastFolder.deleteBtn.waitForClickable({timeout: 20000});
    lastFolder.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    foldersPage.cancelDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();
    const rowNumAfterCancelDelete = foldersPage.rowNum;
    expect(rowNumBeforeDelete).equal(rowNumAfterCancelDelete);
  });
});