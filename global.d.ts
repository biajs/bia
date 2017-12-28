declare module NodeJS  {
    interface Global {
        compile: Function;
        component: Function;
        expect: Function;
        render: Function;
    }
}