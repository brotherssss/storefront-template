import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ProductsService } from '../../shared/services/products.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @Output() categoryChange: EventEmitter<any> = new EventEmitter<any>();

  public categories: any[] = [];
  
  public selectedCategory: string = '';

  constructor(private productService: ProductsService) {}

  public ngOnInit(): void {
    this.loadCategories();
  }

  public loadCategories(): void {
    this.productService.fetchCategories().subscribe(
      (data) => {
        this.categories = data.product_categories; // Adjust based on the actual API response structure
      },
      (error) => console.error('Error fetching categories:', error)
    );
  }

  public onCategoryClick(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.categoryChange.emit({ category_id: categoryId });
  }
}
