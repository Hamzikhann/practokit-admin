import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { RoleService } from 'src/app/services/role/role.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css'],
})
export class UserListingComponent implements OnInit {
  selectedClassCourses: any[] = [];
  filterClassCourses: any[] = [];
  dropdownOpen = false;
  searchQueryOfClassCourses: string = '';

  //////////////////////////////

  loading: boolean = false;
  currentUser: any;
  currentOptionsConfig = Object.assign(
    {},
    {
      highlight: false,
      create: false,
      persist: true,
      plugins: ['dropdown_direction', 'remove_button'],
      dropdownDirection: 'down',
    },
    {
      labelField: 'label',
      valueField: 'value',
      searchField: ['label', 'value'],
      maxItems: 10,
    }
  );
  tagDropdownSettings: IDropdownSettings = {};

  classCourses: any = [];
  classCoursesList: any = [];
  selectedCourses: any = [];
  usersList: any = [];
  filteredUsersList: any = [];
  rolesList: any;
  filterRole: string = '';
  selectedUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    selectedCourses: any;
  } = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    selectedCourses: [],
  };
  addUser: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } = { firstName: '', lastName: '', email: '', role: '' };
  updateUser: {
    role: string;
    selectedCourses: any;
  } = { role: '', selectedCourses: [] };
  selectedRole: string = '';

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private gradeService: GradeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.tagDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };

    this.loading = true;
    let user: any = localStorage.getItem('user');
    this.currentUser = JSON.parse(user);
    this.getRoles();
    this.getUsers();
  }

  getRoles() {
    this.roleService.getAllRoles().subscribe((res) => {
      this.rolesList = res.body;
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe((res) => {
      this.usersList = res.body;
      this.usersList.forEach((element: { id: any }, index: any) => {
        if (element.id == this.currentUser.id) {
          this.usersList.splice(index, 1);
        }
      });
      this.filteredUsersList = this.usersList;

      this.sort();
      this.getClassCourses();
      this.loading = false;
    });
  }

  getClassCourses() {
    this.gradeService.getGradesWithCourses().subscribe((res) => {
      this.classCourses = res.body;
      this.classCourses.forEach(
        (classObj: { courses: any[]; title: string }) => {
          classObj.courses.forEach((course: { id: any; title: string }) => {
            this.classCoursesList.push({
              courseId: course.id,
              label: classObj.title + ' - ' + course.title,
              value: course.id,
              title: classObj.title + ' - ' + course.title,
            });
          });
        }
      );
      this.filterClassCourses = this.classCoursesList;

      // console.log(this.filterClassCourses);
    });
  }

  selectUser(user: {
    role: { title: string };
    teaches: any[];
    id: any;
    firstName: any;
    lastName: any;
    email: any;
  }) {
    var courses: any[] = [];
    if (user.role.title == 'Teacher') {
      user.teaches.forEach((course: { courseId: any }) => {
        courses.push(course.courseId);
      });
    }

    this.selectedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.title,
      selectedCourses: courses,
    };
    this.updateUser.role = this.selectedUser.role;
    this.updateUser.selectedCourses = this.selectedUser.selectedCourses;
  }

  AddUser() {
    var error = '';

    if (!this.addUser.firstName) {
      error = 'Enter user first name.';
    } else if (!this.addUser.lastName) {
      error = 'Enter user last name.';
    } else if (!this.addUser.email) {
      error = 'Enter user email.';
    } else if (!this.addUser.role) {
      error = 'Select role.';
    } else if (this.selectedRole == 'Teacher' && !this.selectedClassCourses) {
      error = 'Select Subjects.';
    }

    if (error) {
      this.toastr.info(error);
    } else {
      let selectedClassCoursesId: any[] = [];
      this.selectedClassCourses.forEach((id: any) => {
        selectedClassCoursesId.push(id.courseId);
      });
      // console.log(selectedClassCoursesId);

      var payload = {
        firstName: this.addUser.firstName,
        lastName: this.addUser.lastName,
        email: this.addUser.email,
        role: this.addUser.role,
        courses: selectedClassCoursesId,
      };
      this.userService.addUser(payload).subscribe((res) => {
        this.toastr.success('User added Successfully!');
        let clk: any = document.getElementById('dismissAddModal');
        clk.click();
        this.resetAddUser();
        this.getUsers();
      });
    }
  }

  confirmUpdateUser() {
    if (
      this.selectedUser.role == 'Teacher' &&
      this.updateUser.role != 'Teacher'
    ) {
      let clk: any = document.getElementById('openModalButton');
      clk.click();
    } else {
      this.UpdateUser();
    }
  }

  UpdateUser() {
    let selectedCourseids: any[] = [];
    // console.log(this.selectedClassCourses);
    this.selectedClassCourses.forEach((e) =>
      selectedCourseids.push(e.courseId)
    );

    var payload = {
      role: this.rolesList[
        this.rolesList
          .map(function (e: { title: any }) {
            return e.title;
          })
          .indexOf(this.updateUser.role)
      ].id,
      courses: selectedCourseids,
    };

    this.userService
      .updateUserRole(this.selectedUser.id, payload)
      .subscribe((res) => {
        this.toastr.success('User Updated Successfully!');
        let clk: any = document.getElementById('dismissUpdateModal');
        clk.click();
        this.resetUpdateUser();
        this.getUsers();
      });
  }

  deleteUser() {
    if (!this.selectedUser.id) {
      this.toastr.info('User is not Selected');
    } else {
      this.userService.deleteUser(this.selectedUser.id).subscribe((res) => {
        this.toastr.success('User deleted Successfully!');
        let clk: any = document.getElementById('dismissDeleteModal');
        clk.click();
        this.resetSelectedUser();
        this.getUsers();
      });
    }
  }

  Filter() {
    this.filteredUsersList = [];
    if (this.filterRole) {
      this.usersList.forEach((user: { role: { id: string } }) => {
        if (this.filterRole == user.role.id) {
          this.filteredUsersList.push(user);
        }
      });
    } else {
      this.filteredUsersList = this.usersList;
      this.sort();
    }
  }

  resetAddUser() {
    this.addUser = { firstName: '', lastName: '', email: '', role: '' };
  }

  resetSelectedUser() {
    this.selectedUser = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      selectedCourses: '',
    };
  }

  resetUpdateUser() {
    this.updateUser.role =
      this.rolesList[
        this.rolesList
          .map(function (e: { title: any }) {
            return e.title;
          })
          .indexOf(this.selectedUser.role)
      ].id;
  }

  sort() {
    this.filteredUsersList.sort(function (
      a: { title: number },
      b: { title: number }
    ) {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
  }

  changeRole(roleId: any) {
    this.selectedRole =
      this.rolesList[
        this.rolesList
          .map(function (e: { id: any }) {
            return e.id;
          })
          .indexOf(roleId)
      ].title;
  }

  /////////////////////////////////////

  addCourse(name: any, id: any, event: any) {
    event.stopPropagation();

    // console.log(name, id);
    let tags: any = {
      title: name,
      courseId: id,
    };
    this.selectedClassCourses.push(tags);
    // console.log(this.selectedClassCourses);
    this.filterClassCourses = this.filterClassCourses.filter(
      (course) => course.title.trim() !== name.trim()
    );
  }

  removeCourse(index: number, cour: any, event: any) {
    event.stopPropagation();

    this.selectedClassCourses.splice(index, 1);
    // console.log(this.selectedTags);

    this.filterClassCourses.push(cour);
    // console.log(this.filterClassCourses);

    if (this.filterClassCourses.length == 0) {
      this.filterClassCourses = this.classCoursesList;
    }
  }
  onInputChange() {
    this.dropdownOpen = true;
    let courses: any[] = [];
    this.selectedClassCourses.forEach((e) => {
      courses.push(e.title);
    });

    if (this.searchQueryOfClassCourses !== '') {
      this.filterClassCourses = this.classCoursesList.filter(
        (course: { title: string }) => !courses.includes(course.title)
      );
      // console.log(this.selectedClassCourses, this.filterClassCourses);

      this.filterClassCourses = this.filterClassCourses.filter(
        (course: { title: string }) =>
          course.title
            .toLowerCase()
            .includes(this.searchQueryOfClassCourses.toLowerCase())
      );
    } else {
      this.filterClassCourses = this.classCoursesList.filter(
        (course: { title: any }) => !courses.includes(course.title)
      );
    }
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  onClickedOutside(event: any) {
    if (event) {
      this.dropdownOpen = false;
    } else {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }
}
