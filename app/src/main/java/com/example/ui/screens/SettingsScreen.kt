package com.example.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.StudioViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: StudioViewModel,
    onBack: () -> Unit
) {
    var hindiLanguage by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack, modifier = Modifier.testTag("back_button")) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Hindi Interface / हिंदी भाषा", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Text("Switch app language between English and Hindi", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                }
                Switch(checked = hindiLanguage, onCheckedChange = { hindiLanguage = it }, modifier = Modifier.testTag("hindi_language_switch"))
            }

            Divider()

            Text("Storage & Cache", fontWeight = FontWeight.Bold, fontSize = 15.sp)
            OutlinedButton(onClick = { }, modifier = Modifier.fillMaxWidth()) {
                Text("Clear Temporary Cache (142 MB)")
            }

            Divider()

            Text("About EditAI Studio", fontWeight = FontWeight.Bold, fontSize = 15.sp)
            Text("Version 1.0.0 (Pro Edition)\nProfessional AI Video Editor, Photo Editor & Audio Studio.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
        }
    }
}
