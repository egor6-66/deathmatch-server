import process from 'process';

const base = () => ({
    envFilePath: `.${process.env.NODE_ENV}.env`,
});

export default base;
