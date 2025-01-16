namespace app;


public record JoinSession(
    string connectType,
    string? GameCode,
    DefaultSettings Settings
);
    

public record DefaultSettings(
    int roundTimeInput,
    int numberOfRoundsInput,
    int wordLengthInput, //la till parametern för wordlength
    bool extraPointsCheckbox
    );