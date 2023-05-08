import { Component, OnInit } from '@angular/core';
import { CursosService } from './services/cursos.service';
import { MatTableDataSource } from '@angular/material/table';
import { AbmCursosComponent } from './components/abm-cursos/abm-cursos.component';
import { MatDialog } from '@angular/material/dialog';
import { Curso } from './models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss'],
})
export class CursosComponent implements OnInit {
  dataSource = new MatTableDataSource<Curso>();

  displayedColumns = [
    'id',
    'nombre',
    'fecha_inicio',
    'fecha_fin',
    'detalle',
    'editar',
    'eliminar',
  ];

  constructor(
    private cursosService: CursosService,
    private matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.cursosService.obtenerCursos().subscribe((cursos) => {
      this.dataSource.data = cursos;
    });
  }

  ngOnInit(): void {
    this.cursosService.obtenerCursos().subscribe({
      next: (cursos) => {
        this.dataSource.data = cursos;
      },
    });
  }

  crearCurso(): void {
    const dialog = this.matDialog.open(AbmCursosComponent);
    dialog.afterClosed().subscribe((formValue) => {
      if (formValue) {
        this.cursosService.crearCurso(formValue);
      }
    });
  }

  editarCurso(cursoParaEditar: Curso): void {
    const dialog = this.matDialog.open(AbmCursosComponent, {
      data: {
        cursoParaEditar,
      },
    });
    dialog.afterClosed().subscribe((valorDelFormulario) => {
      if (valorDelFormulario) {
        this.dataSource.data = this.dataSource.data.map((cursoActual) =>
          cursoActual.id === cursoParaEditar.id
            ? { ...cursoActual, ...valorDelFormulario } // { nombre: 'xxxxxx', apellido: 'xxxxx' }
            : cursoActual
        );
      }
    });
  }

  eliminarCurso(curso: Curso): void {
    if (confirm('Está seguro?')) {
      this.cursosService.eliminarCurso(curso.id);
    }
  }

  aplicarFiltros(ev: Event): void {}

  irAlDetalle(cursoId: number): void {
    this.router.navigate([cursoId], {
      relativeTo: this.activatedRoute,
    });
  }
}
