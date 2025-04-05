import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { BookService } from '../../shared/services/book/book.service';
import { AuthorService } from '../../shared/services/author/author.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private booksChart: any;
  private publishedChart: any;
  private authorGenderChart: any;
  private lineChart: any;
  private books: any[] = [];
  private authors: any[] = [];
  private updateSubscription!: Subscription;
  private realtimeData: [string, number][] = [];

  constructor(
    private bookService: BookService,
    private authorService: AuthorService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.initializeCharts();
    window.addEventListener('resize', () => {
      this.resizeCharts();
    });

    // Actualizar datos en tiempo real cada 5 segundos
    this.updateSubscription = interval(5000).subscribe(() => {
      this.updateRealtimeData();
    });
  }

  private loadData() {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
      this.initializeBooksByYearChart();
      this.initializePublishedBooksChart();
    });

    this.authorService.getAuthors().subscribe(authors => {
      this.authors = authors;
      this.initializeAuthorGenderChart();
    });
  }

  private initializeCharts() {
    this.initializeLineChart();
  }

  private resizeCharts() {
    this.booksChart?.resize();
    this.publishedChart?.resize();
    this.authorGenderChart?.resize();
    this.lineChart?.resize();
  }

  private initializeBooksByYearChart() {
    const yearCounts = this.getBooksByYear();
    const chartDom = document.getElementById('booksChart');
    if (chartDom) {
      this.booksChart = echarts.init(chartDom);
      const option = {
        title: {
          text: 'Libros por Año',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: Object.keys(yearCounts),
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: 'Cantidad de Libros',
          type: 'bar',
          data: Object.values(yearCounts),
          itemStyle: {
            color: '#1976d2'
          },
          emphasis: {
            itemStyle: {
              color: '#1565c0'
            }
          }
        }]
      };

      this.booksChart.setOption(option);
    }
  }

  private initializePublishedBooksChart() {
    const published = this.books.filter(book => book.published).length;
    const unpublished = this.books.length - published;

    const chartDom = document.getElementById('publishedChart');
    if (chartDom) {
      this.publishedChart = echarts.init(chartDom);
      const option = {
        title: {
          text: 'Estado de Publicación',
          left: 'center',
          top: 0,
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 10,
        //   top: 'middle'
        // },
        series: [{
          name: 'Libros',
          type: 'pie',
          radius: '70%',
          center: ['60%', '50%'],
          data: [
            { value: published, name: 'Publicados' },
            { value: unpublished, name: 'No Publicados' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };

      this.publishedChart.setOption(option);
    }
  }

  private initializeAuthorGenderChart() {
    const genderCount = this.getAuthorsByGender();

    const chartDom = document.getElementById('authorGenderChart');
    if (chartDom) {
      this.authorGenderChart = echarts.init(chartDom);
      const option = {
        title: {
          text: 'Género de Autores',
          left: 'center',
          top: 0,
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 10,
        //   top: 'middle'
        // },
        series: [{
          name: 'Género',
          type: 'pie',
          radius: '70%',
          center: ['60%', '50%'],
          data: Object.entries(genderCount).map(([key, value]) => ({
            name: key,
            value: value
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };

      this.authorGenderChart.setOption(option);
    }
  }

  private initializeLineChart() {
    const chartDom = document.getElementById('lineChart');
    if (chartDom) {
      this.lineChart = echarts.init(chartDom);
      const option = {
        title: {
          text: 'Registros en Tiempo Real',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params: any) {
            const date = new Date(params[0].value[0]);
            return date.toLocaleTimeString() + '<br/>' +
                   'Registros: ' + params[0].value[1];
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          min: 4000,
          max: 12000,
          splitLine: {
            show: true
          }
        },
        series: [{
          name: 'Registros',
          type: 'line',
          showSymbol: false,
          data: this.realtimeData,
          lineStyle: {
            width: 1
          },
          areaStyle: {
            opacity: 0.3,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: '#1976d2'
              }, {
                offset: 1,
                color: 'rgba(25, 118, 210, 0.1)'
              }]
            }
          }
        }]
      };

      this.lineChart.setOption(option);
    }
  }

  private updateRealtimeData() {
    const now = new Date();
    const value = Math.floor(Math.random() * (12000 - 4000 + 1)) + 4000;

    this.realtimeData.push([now.toISOString(), value]);

    // Eliminar datos más antiguos de 2 horas
    const twoHoursAgo = now.getTime() - (2 * 60 * 60 * 1000);
    this.realtimeData = this.realtimeData.filter(item =>
      new Date(item[0]).getTime() > twoHoursAgo
    );

    // Actualizar el gráfico
    if (this.lineChart) {
      this.lineChart.setOption({
        series: [{
          data: this.realtimeData
        }]
      });
    }
  }

  private getBooksByYear(): { [key: string]: number } {
    const yearCounts: { [key: string]: number } = {};
    this.books.forEach(book => {
      const year = book.year.toString();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    return yearCounts;
  }

  private getAuthorsByGender(): { [key: string]: number } {
    const genderCount: { [key: string]: number } = {};
    this.authors.forEach(author => {
      const gender = author.gender;
      genderCount[gender] = (genderCount[gender] || 0) + 1;
    });
    return genderCount;
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => {
      this.resizeCharts();
    });
    this.updateSubscription?.unsubscribe();
    this.booksChart?.dispose();
    this.publishedChart?.dispose();
    this.authorGenderChart?.dispose();
    this.lineChart?.dispose();
  }
}
