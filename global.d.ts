declare module NodeJS  {
    interface Global {
        compile: Function;
        component: Function;
        div: Function;
        expect: Function;
        render: Function;
    }
}