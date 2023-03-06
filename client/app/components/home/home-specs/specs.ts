export const Specs = {
  // general specs for the project
  specs: [
    {
      link: 'https://nodejs.org/',
      label: 'Backend',
      value: 'NodeJS 18.x'
    }, {
      link: 'https://www.postgresql.org/',
      label: 'Database',
      value: 'MySQL 8.x'
    }, {
      link: 'https://expressjs.com/',
      label: 'Backend Framework',
      value: 'ExpressJS 4.x'
    }, {
      link: 'https://angular.io/',
      label: 'Frontend Framework',
      value: 'Angular 14'
    }
  ],
  // github repositories
  repositories: [
    {
      label: 'Server',
      link: 'https://github.com/thePortus/icam-server',
      value: 'icam-server'
    }, {
      label: 'Client',
      link: 'https://github.com/thePortus/icam-client',
      value: 'icam-client'
    }, {
      label: 'Data',
      link: 'https://github.com/thePortus/icam-data',
      value: 'icam-data'
    }
  ],
  // project dependenceis
  dependencies: {
    frontend: [
      {
        link: 'https://www.npmjs.com/package/@angular/animations',
        label: '@angular/animations'
      }, {
        link: 'https://www.npmjs.com/package/@angular/cdk',
        label: '@angular/cdk'
      }, {
        link: 'hhttps://www.npmjs.com/package/@angular/common',
        label: '@angular/common'
      }, {
        link: 'https://www.npmjs.com/package/@angular/compiler',
        label: '@angular/compiler'
      }, {
        link: 'https://www.npmjs.com/package/@angular/core',
        label: '@angular/core'
      }, {
        link: 'https://www.npmjs.com/package/@angular/flex-layout',
        label: '@angular/flex-layout'
      }, {
        link: 'https://www.npmjs.com/package/@angular/forms',
        label: '@angular/forms'
      }, {
        link: 'https://www.npmjs.com/package/@angular/material',
        label: '@angular/material'
      }, {
        link: 'https://www.npmjs.com/package/@angular/platform-browser',
        label: '@angular/platform-browser'
      }, {
        link: 'https://www.npmjs.com/package/@angular/platform-browser-dynamic',
        label: '@angular/platform-browser-dynamic'
      }, {
        link: 'https://www.npmjs.com/package/@angular/router',
        label: '@angular/router": "~13.3.0'
      }, {
        link: 'https://www.npmjs.com/package/rxjs',
        label: 'rxjs'
      }, {
        link: 'https://www.npmjs.com/package/tslib',
        label: 'tslib'
      }, {
        link: 'https://www.npmjs.com/package/zone.js',
        label: 'zone.js'
      }
    ],
    backend: [
      {
        link: 'https://www.npmjs.com/package/cors',
        label: 'cors'
      }, {
        link: 'https://www.npmjs.com/package/express',
        label: 'express'
      }, {
        link: 'https://www.npmjs.com/package/mysql2',
        label: 'mysql2'
      }, {
        link: 'https://www.npmjs.com/package/sequelize',
        label: 'sequelize'
      }
    ],
    developer: [
      {
        link: 'https://www.npmjs.com/package/build-angular',
        label: '@angular-devkit/build-angular'
      }, {
        link: 'https://www.npmjs.com/package/@angular/cli',
        label: '@angular/cli'
      }, {
        link: 'https://www.npmjs.com/package/compiler-cli',
        label: '@angular/compiler-cli'
      }, {
        link: 'https://www.npmjs.com/package/@types/jasmine',
        label: '@types/jasmine'
      }, {
        link: 'https://www.npmjs.com/package/@types/node',
        label: '@types/node'
      }, {
        link: 'https://www.npmjs.com/package/jasmine-core',
        label: 'jasmine-core'
      }, {
        link: 'https://www.npmjs.com/package/karma',
        label: 'karma'
      }, {
        link: 'https://www.npmjs.com/package/karma-chrome-launcher',
        label: 'karma-chrome-launcher'
      }, {
        link: 'https://www.npmjs.com/package/karma-coverage',
        label: 'karma-coverage'
      }, {
        link: 'https://www.npmjs.com/package/karma-jasmine',
        label: 'karma-jasmine'
      }, {
        link: 'https://www.npmjs.com/package/karma-jasmine-html-reporter',
        label: 'karma-jasmine-html-reporter'
      }, {
        link: 'https://www.npmjs.com/package/typescript',
        label: 'typescript'
      }
    ]
  },
  // ERD diagram
  erd: 'assets/images/erd.png',
};
