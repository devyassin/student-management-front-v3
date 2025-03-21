import { Directive, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

// Define generic interface for all entities
export interface BaseEntity {
  _id: string;
  [key: string]: any;
}

// Generic service interface
export interface CrudService<T extends BaseEntity> {
  getAll(): Observable<T[]>;
  getById(id: string): Observable<T>;
  create(entity: Partial<T>): Observable<any>;
  update(id: string, entity: Partial<T>): Observable<any>;
  delete(id: string): Observable<any>;
}

@Directive()
export abstract class BaseCrudComponent<T extends BaseEntity> implements OnInit {
  items: T[] = [];
  filteredItems: T[] = [];
  selectedItem: T | undefined;
  errorMessage: string = '';
  isDialogVisible: boolean = false;
  isAddDialogVisible: boolean = false;
  isUpdateDialogVisible: boolean = false;
  loading: boolean = false;
  searchQuery: string = '';
  newItem: Partial<T> = {};
  updatedItem: Partial<T> = {};

  // Inject common services
  protected messageService = inject(MessageService);
  protected confirmationService = inject(ConfirmationService);

  // Define search fields for filtering
  protected abstract searchFields: (keyof T)[];
  
  // Required validation fields
  protected abstract requiredFields: string[];

  // Abstract service to be provided by subclasses
  protected abstract service: CrudService<T>;

  ngOnInit(): void {
    this.getAllItems();
  }

  getAllItems(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data: T[]) => {
        this.items = data;
        this.filteredItems = [...this.items];
        this.loading = false;
      },
      error: (error: any) => {
        this.errorMessage = `Failed to load ${this.getEntityName(true)}`;
        this.showError(this.errorMessage);
        this.loading = false;
      },
    });
  }

  getItemById(id: string, forUpdate: boolean = false): void {
    this.service.getById(id).subscribe({
      next: (data: T) => {
        this.selectedItem = data;
        forUpdate
          ? (this.isUpdateDialogVisible = true)
          : (this.isDialogVisible = true);
      },
      error: (error: any) => {
        this.errorMessage = `${this.getEntityName()} not found`;
        this.showError(this.errorMessage);
      },
    });
  }

  searchItems(): void {
    if (!this.searchQuery.trim()) {
      this.filteredItems = [...this.items];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredItems = this.items.filter((item) => {
      return this.searchFields.some(field => {
        const value = item[field as string];
        return value && String(value).toLowerCase().includes(query);
      }) || (item._id && item._id.toLowerCase().includes(query));
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredItems = [...this.items];
  }

  openAddDialog(): void {
    this.newItem = {};
    this.isAddDialogVisible = true;
  }

  openUpdateDialog(item: T): void {
    this.selectedItem = item;
    this.updatedItem = this.prepareForUpdate(item);
    this.isUpdateDialogVisible = true;
  }

  // Allow components to customize what data is used for updates
  protected prepareForUpdate(item: T): Partial<T> {
    // Default implementation - override in subclasses if needed
    return { ...item };
  }

  onSubmitUpdate(form: NgForm): void {
    if (form.valid && this.selectedItem) {
      this.updateItem(this.selectedItem._id, this.updatedItem);
      this.closeDialog();
    }
  }

  createItem(): void {
    // Check required fields
    for (const field of this.requiredFields) {
      if (!this.newItem[field]) {
        this.showError('Please fill in all required fields');
        return;
      }
    }

    this.service.create(this.newItem).subscribe({
      next: (response: any) => {
        const newEntity = this.extractEntityFromResponse(response);
        this.items.push(newEntity);
        this.filteredItems = [...this.items];
        this.isAddDialogVisible = false;
        this.showSuccess(`${this.getEntityName()} created successfully`);
      },
      error: (error: any) => {
        this.errorMessage = `Failed to create ${this.getEntityName()}`;
        this.showError(this.errorMessage);
      },
    });
  }

  updateItem(id: string, item: Partial<T>): void {
    this.service.update(id, item).subscribe({
      next: (response: any) => {
        const updatedEntity = this.extractEntityFromResponse(response);
        this.items = this.items.map((i) => (i._id === id ? updatedEntity : i));
        this.filteredItems = this.filteredItems.map((i) => 
          i._id === id ? updatedEntity : i
        );
        this.showSuccess(`${this.getEntityName()} updated successfully`);
      },
      error: (error: any) => {
        this.errorMessage = `Failed to update ${this.getEntityName()}`;
        this.showError(this.errorMessage);
      },
    });
  }

  confirmDelete(id: string): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this ${this.getEntityName()}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItem(id);
      },
    });
  }

  deleteItem(id: string): void {
    this.service.delete(id).subscribe({
      next: () => {
        this.items = this.items.filter((i) => i._id !== id);
        this.filteredItems = this.filteredItems.filter((i) => i._id !== id);
        this.showSuccess(`${this.getEntityName()} deleted successfully`);
      },
      error: (error: any) => {
        this.errorMessage = `Failed to delete ${this.getEntityName()}`;
        this.showError(this.errorMessage);
      },
    });
  }

  closeDialog(): void {
    this.isDialogVisible = false;
    this.isUpdateDialogVisible = false;
    this.selectedItem = undefined;
    this.updatedItem = {};
  }

  closeAddDialog(): void {
    this.isAddDialogVisible = false;
    this.newItem = {};
  }

  showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  // Helper methods to handle entity names
  protected abstract getEntityName(plural?: boolean): string;
  
  // Extract entity from API response - can be overridden by subclasses
  protected extractEntityFromResponse(response: any): T {
    // Default implementation assumes response structure like { entity: {...} }
    // Override this in subclasses if the structure is different
    const entityKey = this.getEntityName().toLowerCase();
    return response[entityKey];
  }
}