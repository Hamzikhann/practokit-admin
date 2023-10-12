import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
// import { differenceWith, intersectionWith } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/app/services/course/course.service';
import { DifficultyService } from 'src/app/services/difficulty/difficulty.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { QuestionService } from 'src/app/services/question/question.service';
import { QuestionTypeService } from 'src/app/services/questionType/question-type.service';
import { TagService } from 'src/app/services/questionTag/tag.service';
import { environment } from 'src/environments/environment';
import { Dropbox } from 'dropbox';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css'],
})
export class AddQuestionComponent implements OnInit {
  selectedTags: any[] = [];
  filterTags: any[] = [];
  dropdownOpen = false;
  searchQueryOfTags: string = '';

  ///////////////////////
  loading: boolean = true;
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
  uploadFileSize: number = environment.uploadFileSize;
  uploadFolder: string = environment.dropBoxFolder;
  imageSource: string = environment.fileSource;
  questionId: string | null = ''; // For Editing an existing question.
  editMode: boolean = false; // For Editing an existing question.
  questionTypeList: any = [];
  gradeList: any = [];
  coursesList: any = [];
  difficultyList: any = [];
  gradeId: string = '';
  courseId: string = '';
  typeId: string = '';
  typeTitle: string = '';
  difficultyId: string = '';
  questionStatement: string = '';
  questionFile: any = null;
  questionFileName: string = '';
  options: string = '';
  optionsLink: string = 'optionsLink';
  optionsArray: {
    title: string;
    correct: boolean;
    file: File | null;
    name: string;
    link: string;
  }[] = [
    {
      title: '',
      correct: false,
      file: null,
      name: '',
      link: '',
    },
    {
      title: '',
      correct: false,
      file: null,
      name: '',
      link: '',
    },
    {
      title: '',
      correct: false,
      file: null,
      name: '',
      link: '',
    },
    {
      title: '',
      correct: false,
      file: null,
      name: '',
      link: '',
    },
  ];
  filesArray: {
    file: File;
    name: string;
    link: string;
  }[] = [];
  correctOption: any;
  blank: string = '';
  hintStatement: string = '';
  hintFile: any = null;
  hintFileName: string = '';
  hintLink: string = 'Hints';
  solutionFile: any = null;
  solutionFileName: string = '';
  soluctionLink: any = 'Soluction';
  points: any = 0;
  recommendedPoints: number = 0;
  time: any = 30;
  tagList: any = [];
  // selectedTags: any = [];
  tagDropdownSettings: IDropdownSettings = {};
  secondsArray = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300];
  statementImageFile: any = null;
  statementLink: string = 'Statement';
  hintImageFile: any = null;
  solutionImageFile: any = null;
  currentOptions: any;
  addTag: {
    title: string;
    gradeId: string;
    courseId: string;
  } = { title: '', gradeId: '', courseId: '' };

  disableButton: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private qTypeService: QuestionTypeService,
    private gradeService: GradeService,
    private courseService: CourseService,
    private tagService: TagService,
    private diffService: DifficultyService,
    private questionService: QuestionService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.questionId = this.activatedRoute.snapshot.paramMap.get('questionId');
    this.getQuestionTypes();
    this.tagDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
    // check if we are editing a question. set edit mode to true and fetch question data.
    if (this.questionId && this.questionId != '') {
      this.editMode = true;
      this.setQuestionData();
    }
  }

  setQuestionData() {
    this.questionService.getQuestionsById(this.questionId).subscribe((res) => {
      // console.log(res.body);
      var question: any = res.body;
      this.points = question.points;
      this.gradeId = question.course.class.id;
      this.courseId = question.course.id;
      this.typeId = question.questionType.id;
      this.typeTitle = question.questionType.title;
      this.difficultyId = question.questionDifficulty.id;
      this.questionStatement = question.statement;
      this.questionFileName = question.questionsAttribute?.statementFileName;
      this.solutionFileName = question.questionsAttribute?.solutionFileName;
      this.hintStatement = question.questionsAttribute?.hint;
      this.hintFileName = question.questionsAttribute?.hintFileName;
      this.time = question.duration;
      if (this.typeTitle == 'MCQ') {
        this.optionsArray = [];
        question.questionsOptions.forEach(
          (
            option: { correct: any; image: any; fileName: any; title: any },
            index: { toString: () => any }
          ) => {
            this.optionsArray.push({
              correct: option.correct,
              file: null,
              link: option.image,
              name: option.fileName,
              title: option.title,
            });
            if (option.correct) this.correctOption = index.toString();
          }
        );
      } else if (this.typeTitle == 'Fill in the Blank') {
        this.blank = question.questionsOptions[0].title;
      } else if (this.typeTitle == 'True/False') {
        this.correctOption = question.questionsOptions[0].correct ? '0' : '1';
      }
      question.questionTags.map((tag: { tag: { id: any } }) => {
        console.log(tag);
        this.selectedTags.push(tag.tag);
      });
    });
  }

  getQuestionTypes() {
    this.qTypeService.getAllTypes().subscribe((res) => {
      this.questionTypeList = res.body;
      if (this.questionTypeList.length) {
        this.typeId =
          this.questionTypeList[
            this.questionTypeList
              .map((e: { title: any }) => {
                return e.title;
              })
              .indexOf('MCQ')
          ].id;
        this.typeTitle = 'MCQ';
      }
      this.getDifficulties();
    });
  }

  getDifficulties() {
    this.diffService.getAllDifficulties().subscribe((res) => {
      this.difficultyList = res.body;
      this.recommendedPoints =
        this.difficultyList
          .map((x: { id: any }) => {
            return x.id;
          })
          .indexOf(this.difficultyId) + 1;
      this.getClasses();
    });
  }

  getClasses() {
    this.gradeService.getAllGrades().subscribe((res) => {
      this.gradeList = res.body;
      // When editing a question, get courses from the start.
      if (this.editMode) {
        this.getCourses();
      }
      this.loading = false;
    });
  }

  getCourses() {
    this.tagList = [];
    this.courseService.getCourses(this.gradeId).subscribe((res) => {
      this.coursesList = res.body;
      // When editing a question, get courses from the start.
      if (this.editMode) {
        this.getTags();
      }
    });
  }

  getTags() {
    this.tagService.getTagsByCourseId(this.courseId).subscribe((res) => {
      // console.log(res.body);
      this.tagList = res.body;
      this.filterTags = this.tagList;
      this.filterTags.forEach(
        (element: { title: any; id: any }, index: string | number) => {
          this.tagList[index].label = element.title;
          this.tagList[index].value = element.id;
        }
      );
      // console.log(this.filterTags);
    });
  }

  setType(type: { title: string }) {
    this.typeTitle = type.title;
  }

  AddOption() {
    if (this.optionsArray.length < 8) {
      this.optionsArray.push({
        title: '',
        correct: false,
        file: null,
        name: '',
        link: '',
      });
    }
  }

  removeOptions(index: number) {
    if (this.optionsArray.length > 2) this.optionsArray.splice(index, 1);
  }

  CheckFileSize(file: any): boolean {
    if (file.target.files[0].size < this.uploadFileSize) {
      return true;
    } else {
      this.toastr.error('File size should be less than 5 MB!');
      return false;
    }
  }

  onQuestionInput(file: any) {
    if (
      file.target.files[0].type != 'image/jpeg' &&
      file.target.files[0].type != 'image/png'
    ) {
      this.toastr.error('Only png or jpg file accepted !');
    } else if (this.CheckFileSize(file)) {
      this.questionFile = file.target.files[0];
      if (this.editMode) this.questionFileName = file.target.files[0].name;
    }
  }

  onOptionInput(file: any, index: number) {
    if (
      file.target.files[0].type != 'image/jpeg' &&
      file.target.files[0].type != 'image/png'
    ) {
      this.toastr.error('Only png or jpg file accepted !');
    } else if (this.CheckFileSize(file)) {
      this.optionsArray[index].file = file.target.files[0];
      this.optionsArray[index].name = file.target.files[0].name;
      // this.optionsArray[index].link = this.getFileLink(
      //   'Question Options',
      //   file
      // );
    }
  }

  onHintInput(file: any) {
    if (
      file.target.files[0].type != 'image/jpeg' &&
      file.target.files[0].type != 'image/png'
    ) {
      this.toastr.error('Only png or jpg file accepted !');
    } else if (this.CheckFileSize(file)) {
      this.hintFile = file.target.files[0];
      if (this.editMode) this.hintFileName = file.target.files[0].name;
    }
  }

  onSolutionInput(file: any) {
    if (this.CheckFileSize(file)) {
      this.solutionFile = file.target.files[0];
      if (this.editMode) this.solutionFileName = file.target.files[0].name;
    }
  }

  emptyChecks() {
    if (!this.gradeId) {
      this.toastr.info('Select a Class/Grade');
    } else if (!this.typeId) {
      this.toastr.info('Select a Question Type');
    } else if (!this.courseId) {
      this.toastr.info('Select a Course');
    } else if (!this.difficultyId) {
      this.toastr.info('Select a Difficulty');
    } else if (this.questionStatement.trim() == '') {
      this.toastr.info('Enter Question Statement');
    } else if (this.optionsArray.length < 2) {
      this.toastr.info('Question must have at least 2 options.');
    } else if (this.typeTitle == 'MCQ' && this.optionsArray.length > 8) {
      this.toastr.info('Options cannot be more than 8.');
    } else if (this.typeTitle == 'MCQ' && !this.correctOption) {
      this.toastr.info('Select the correct option.');
    } else if (this.typeTitle == 'MCQ' && !this.correctOption) {
      this.toastr.info('Select the correct option.');
    } else if (this.typeTitle == 'Fill in the Blank' && !this.blank) {
      this.toastr.info('Enter blank.');
    } else if (!this.points || this.points < 0 || this.points > 5) {
      this.toastr.info('Points can be between 1 & 5.');
    } else if (!this.time) {
      this.toastr.info('Time can be between 1 & 5 minutes.');
    } else if (this.selectedTags.length < 1) {
      this.toastr.info('Select one or more tags.');
    } else {
      var error: boolean = false;
      if (this.typeTitle == 'MCQ') {
        this.optionsArray.forEach((option, index) => {
          if (option.title.trim() == '' && option.file == null) {
            this.toastr.info(
              'Option ' + (index + 1) + ' doesnt have a statment or an image.'
            );
            error = true;
          }
        });
      }

      if (!error) {
        this.disableButton = true;
        this.submit();
        // this.UploadFilesToDropbox();
      } else {
        console.log(error);
      }
    }
  }

  UploadFilesToDropbox() {
    this.filesArray = [];
    if (this.questionFile) {
      this.statementImageFile = this.getFileLink(
        'Questions'
        // this.questionFile
      );

      this.filesArray.push({
        file: this.questionFile,
        name: this.questionFile.name,
        link: this.statementImageFile,
      });
    }
    if (this.hintFile) {
      // this.hintImageFile = this.getFileLink('Hints', this.hintFile);

      this.filesArray.push({
        file: this.hintFile,
        name: this.hintFile.name,
        link: this.hintImageFile,
      });
    }
    if (this.solutionFile) {
      // this.solutionImageFile = this.getFileLink('Solutions', this.solutionFile);

      this.filesArray.push({
        file: this.solutionFile,
        name: this.solutionFile.name,
        link: this.solutionImageFile,
      });
    }
    this.optionsArray.forEach((option) => {
      if (option.file) {
        this.filesArray.push({
          file: option.file,
          name: option.name,
          link: option.link,
        });
      }
    });
    if (this.filesArray.length) {
      // document.body.classList.add('loading');
      this.toastr.info('Uploading File(s)!');
      // let dbx = new Dropbox({ accessToken: environment.dropBoxToken });
      // this.filesArray.forEach((fileData, index) => {
      //   setTimeout(() => {
      //     dbx
      //       .filesUpload({ path: fileData.link, contents: fileData.file })
      //       .then((res) => {
      //         if (res.status == 200) {
      //           if (index == this.filesArray.length - 1) {
      //             this.toastr.clear();
      //             this.toastr.info('All File(s) Uploaded!');
      //             this.submit();
      //           } else {
      //             this.toastr.info('"' + fileData.name + '" File Uploaded!');
      //           }
      //         } else {
      //           this.toastr.error('An error occured while uploading File(s)');
      //         }
      //       });
      //   }, index * 5000);
      // });
    } else {
      this.submit();
    }
  }

  submit() {
    var optionsToSend: any[] = [];

    if (this.typeTitle == 'MCQ') {
      this.optionsArray[this.correctOption].correct = true;
      this.optionsArray.forEach((option) => {
        var op = {
          title: option.title,
          image: option.file,
          imageSource: this.imageSource,
          fileName: option.name,
          correct: option.correct,
        };
        optionsToSend.push(op);
      });
    } else if (this.typeTitle == 'True/False') {
      optionsToSend.push(
        {
          title: 'true',
          correct: this.correctOption == 0 ? true : false,
          image: '',
          imageSource: '',
          fileName: '',
        },
        {
          title: 'false',
          correct: this.correctOption == 1 ? true : false,
          image: '',
          imageSource: '',
          fileName: '',
        }
      );
    } else if (this.typeTitle == 'Fill in the Blank') {
      optionsToSend.push({
        title: this.blank,
        correct: true,
        image: '',
        imageSource: '',
        fileName: '',
      });
    }
    let tagid: any[] = [];
    this.selectedTags.forEach((id) => tagid.push(id.id));
    // console.log(tagid);
    // console.log(optionsToSend);
    this.hintLink = this.getFileLink(this.hintLink);
    this.soluctionLink = this.getFileLink(this.soluctionLink);
    this.statementLink = this.getFileLink(this.statementLink);
    this.optionsLink = this.getFileLink(this.optionsLink);

    console.log(this.hintLink, this.soluctionLink, this.statementLink);

    var payload = new FormData();
    payload.append('optionsLink', this.optionsLink);
    payload.append('hintLink', this.hintLink);
    payload.append('soluctionLink', this.soluctionLink);
    payload.append('statementLink', this.statementLink);
    payload.append('courseId', this.courseId);
    payload.append('typeId', this.typeId);
    payload.append('difficultyId', this.difficultyId);
    payload.append('statement', this.questionStatement);
    payload.append('duration', this.time);
    payload.append('points', this.points);
    payload.append('hint', this.hintStatement || '');
    payload.append('tagIds', JSON.stringify(tagid));
    payload.append('statementImageSource', this.imageSource);
    payload.append('hintFileSource', this.imageSource);
    payload.append('solutionFileSource', this.imageSource);

    if (this.questionFile) {
      payload.append('statementImage', this.questionFile);
    }
    if (this.hintFile) {
      payload.append('hintFile', this.hintFile);
    }
    if (this.solutionFile) {
      payload.append('solutionFile', this.solutionFile);
    }

    payload.append('statementFileName', '');
    payload.append('hintFileName', '');
    payload.append('solutionFileName', '');
    payload.append('options', JSON.stringify(optionsToSend));

    optionsToSend.forEach((option: any, key: any) => {
      // console.log(key);
      payload.append('options-' + key, option.image);
    });

    // var payload = {
    //   courseId: this.courseId,
    //   typeId: this.typeId,
    //   difficultyId: this.difficultyId,
    //   statement: this.questionStatement,
    //   duration: this.time,
    //   points: this.points,
    //   hint: this.hintStatement || '',
    //   tagIds: tagid,
    //   statementImageSource: this.imageSource,
    //   hintFileSource: this.imageSource,
    //   solutionFileSource: this.imageSource,
    //   statementImage: this.questionFile ? this.statementImageFile : '',
    //   hintFile: this.hintFile ? this.hintImageFile : '',
    //   solutionFile: this.solutionFile ? this.solutionImageFile : '',
    //   statementFileName: this.questionFile ? this.questionFile.name : '',
    //   hintFileName: this.hintFile ? this.hintFile.name : '',
    //   solutionFileName: this.solutionFile ? this.solutionFile.name : '',
    //   options: optionsToSend,
    // };

    if (this.editMode) {
      this.questionService
        .editQuestion(this.questionId, payload)
        .subscribe((res) => {
          this.toastr.success('Question Updated.');
          this.ResetValues();
          this.disableButton = false;
          this.router.navigate(['/questions']);
        });
    } else {
      this.questionService.addQuestion(payload).subscribe((res) => {
        this.toastr.success('Question Added.');
        this.disableButton = false;
        this.ResetValues();
      });
    }
  }

  AddTag() {
    if (this.addTag.title) {
      var payload = {
        title: this.addTag.title,
        courseId: this.courseId,
      };
      this.tagService.addTag(payload).subscribe((res: any) => {
        this.toastr.success('Topic or Tag added Successfully!');

        this.tagList.push({
          id: res.body['tag'].id,
          courseId: this.courseId,
          label: this.addTag.title,
          value: res.body['tag'].id,
          title: this.addTag.title,
        });

        this.resetAddTag();
      });
    } else {
      this.toastr.info('Cannot add empty tag!');
    }
  }

  getFileLink(folderName: string): string {
    console.log(folderName);
    return this.uploadFolder + folderName + '/';
  }

  setPoints() {
    this.recommendedPoints =
      this.difficultyList
        .map((x: { id: any }) => {
          return x.id;
        })
        .indexOf(this.difficultyId) + 1;
    this.points = this.recommendedPoints;
  }

  ResetValues() {
    this.gradeId = '';
    this.courseId = '';
    this.questionStatement = '';
    this.questionFile = null;
    this.options = '';
    this.optionsArray = [];
    this.hintStatement = '';
    this.hintFile = null;
    this.hintFileName = '';
    this.difficultyId = '';
    this.points = 1;
    this.blank = '';
    this.time = 30;
    this.selectedTags = [];
    this.correctOption = null;
    this.points = undefined;
    this.recommendedPoints = 0;
    this.optionsArray = [
      {
        title: '',
        correct: false,
        file: null,
        name: '',
        link: '',
      },
      {
        title: '',
        correct: false,
        file: null,
        name: '',
        link: '',
      },
      {
        title: '',
        correct: false,
        file: null,
        name: '',
        link: '',
      },
      {
        title: '',
        correct: false,
        file: null,
        name: '',
        link: '',
      },
    ];
    this.solutionFile = null;
  }

  resetAddTag() {
    this.addTag = { title: '', gradeId: '', courseId: '' };
  }

  addCourse(name: any, id: any, event: any) {
    event.stopPropagation();
    // console.log(name, id);
    let tags: any = {
      title: name,
      id: id,
    };
    this.selectedTags.push(tags);
    // console.log(this.selectedTags);
    this.filterTags = this.filterTags.filter(
      (course) => course.title.trim() !== name.trim()
    );
  }

  removeCourse(index: number, cour: any, event: any) {
    event.stopPropagation();
    this.selectedTags.splice(index, 1);
    // console.log(this.selectedTags);

    this.filterTags.push(cour);
    // console.log(this.filterTags);

    if (this.selectedTags.length == 0) {
      this.filterTags = this.tagList;
    }
  }
  onInputChange() {
    this.dropdownOpen = true;
    let taags: any[] = [];
    this.selectedTags.forEach((e) => {
      taags.push(e.title);
    });

    if (this.searchQueryOfTags !== '') {
      this.filterTags = this.tagList.filter(
        (course: { title: string }) => !taags.includes(course.title)
      );
      // console.log(this.selectedTags, this.filterTags);
      this.filterTags = this.filterTags.filter((course: { title: string }) =>
        course.title
          .toLowerCase()
          .includes(this.searchQueryOfTags.toLowerCase())
      );
    } else {
      this.filterTags = this.tagList.filter(
        (course: { title: any }) => !taags.includes(course.title)
      );
    }
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  onClickedOutside(event: any) {
    // console.log(event);
    if (event) {
      this.dropdownOpen = false;
    } else {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }
}
