namespace app;

public record JoinSession(
    string connectType,
    string? GameCode,
    DefaultSettings settings
);
    
public record DefaultSettings(
    int roundTimeInput,
    int numberOfRoundsInput,
    bool extraPointsCheckbox
    );