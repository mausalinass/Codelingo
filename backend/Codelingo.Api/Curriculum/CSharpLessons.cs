namespace Codelingo.Api.Curriculum;
public static class CSharpLessons
{
    public static readonly LessonDefinition[] All =
    [
        new("hello", "csharp", "Say Hello to Louis", "A function call asks the program to perform an action. The output function displays text; quotation marks delimit a string literal and are not printed. Keep the greeting and capitalization exactly as requested.", ["Choose the greeting","Pass the string to the output function","Display Hello, Louis!"], new("cs-hello-01", "Print Hello, Louis! exactly.", "// Your code here", ["^\\s*Console\\.WriteLine\\s*\\(\\s*\"Hello,\\s*Louis!\"\\s*\\)\\s*;\\s*$"])),
        new("conditions", "csharp", "Making Decisions with if", "An if statement evaluates an expression that resolves to true or false. The >= operator compares the value on its left with the threshold on its right, including equality. Only when the comparison is true does the program enter the conditional block; otherwise it skips the block. Braces group statements into a block.", ["Evaluate age >= 18","TRUE -> execute block","FALSE -> skip block"], new("cs-if-01", "Print Adult when age is 18 or greater.", "int age = 20;\n\n// Your code here", ["if\\s*\\(\\s*age\\s*>=\\s*18\\s*\\)","Console\\.WriteLine\\s*\\(\\s*\"Adult\"\\s*\\)"])),
        new("loops", "csharp", "Repeat with a Loop", "A loop repeats a block of work. Start the counter at zero, continue while it is less than three, and advance it after each iteration. This visits 0, 1, and 2: three iterations. The for header contains initialization, a continuation test, and an increment.", ["Initialize at 0","Check whether the counter is less than 3","Print the counter and advance","Stop at 3"], new("cs-loop-01", "Use a for loop with i from 0 through 2 and print i.", "// Your loop here", ["for\\s*\\(","i\\s*<\\s*3","i\\+\\+"]))
    ];
}
