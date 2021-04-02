import random



def fuzz_expr(Expression):
    return random.choice(["Expression + Term", "Expression - Term", "Term"])


def fuzz_term(Term):
    return random.choice(["Term * Factor", "Term / Factor", "Factor"])


def fuzz_factor(Factor):
    return random.choice(["-Integer", "Expression", "Integer", "Integer.Integer"])


def fuzz_integer(Integer):
    return random.choice(["Digit", "IntegerDigit"])


def fuzz_digit(Digit):
    return str(random.choice([i for i in range(1, 11)]))


def fuzzer():
    output = "Expression"
    while "Expression" in output:
        output = "(" + fuzz_expr(output) + ")"
        while "Term" in output:
            output = output.replace("Term", fuzz_term("Term"), 1)
        while "Factor" in output:
            output = output.replace("Factor", fuzz_factor("Factor"), 1)
    while "Integer" in output:
        output = output.replace("Integer", fuzz_integer("Integer"), 1)
    while "Digit" in output:
        output = output.replace("Digit", fuzz_digit("Digit"), 1)
    return output[1:-1]

for i in range(6):
    print(fuzzer())
