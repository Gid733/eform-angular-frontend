export class AdvEntitySelectableItemModel {
  name: string;
  description: string;
  entityItemUId: string;
  workflowState: string;
  displayIndex: number;

  constructor(name?: string) {
    this.name = name;
  }
}
