namespace Codelingo.Api.Curriculum;
public static class PythonLessons
{
    public static readonly LessonDefinition[] All =
    [
        new("hello", "python", "Say Hello to Louis", "A function call asks the program to perform an action. The output function displays text; quotation marks delimit a string literal and are not printed. Keep the greeting and capitalization exactly as requested.", ["Choose the greeting","Pass the string to the output function","Display Hello, Louis!"], new("py-hello-01", "Print Hello, Louis! exactly.", "# Your code here", ["^\\s*print\\s*\\(\\s*[\"']Hello,\\s*Louis![\"']\\s*\\)\\s*$"])),
        new("conditions", "python", "Making Decisions with if", "An if statement evaluates an expression that resolves to true or false. The >= operator compares the value on its left with the threshold on its right, including equality. Only when the comparison is true does the program enter the conditional block; otherwise it skips the block. Python uses a colon and indentation to mark the block.", ["Evaluate score >= 70","TRUE -> execute block","FALSE -> skip block"], new("py-if-01", "Print Pass when score is 70 or greater.", "score = 80\n\n# Your code here", ["if\\s+score\\s*>=\\s*70\\s*:","print\\s*\\(\\s*[\"']Pass[\"']\\s*\\)"])),
        new("loops", "python", "Repeat with a Loop", "A loop repeats a block of work. Start the counter at zero, continue while it is less than three, and advance it after each iteration. This visits 0, 1, and 2: three iterations. range(3) supplies these three values.", ["Initialize at 0","Check whether the counter is less than 3","Print the counter and advance","Stop at 3"], new("py-loop-01", "Use a for loop over range(3) to print each number.", "# Your loop here", ["for\\s+\\w+\\s+in\\s+range\\s*\\(\\s*3\\s*\\)\\s*:"]))
    ];
}
